import { decode, encode } from 'bs58check';
import { ecdsaSign, ecdsaVerify, privateKeyTweakAdd, privateKeyVerify, publicKeyConvert, publicKeyCreate, publicKeyTweakAdd, publicKeyVerify } from 'secp256k1';
import crypto from '../crypto-suite/driver';
import { hash160 } from './hd-key-identifier';

// UTF8 Encoded: 'Bitcoin seed'
const MASTER_SECRET = Uint8Array.of(66, 105, 116, 99, 111, 105, 110, 32, 115, 101, 101, 100);
const HARDENED_OFFSET = 0x80000000;
const PACKED_LENGTH = 78;
// Bitcoin hardcoded by default, can use package `coininfo` for others
const BITCOIN_VERSIONS = Object.freeze<Versions>({
  private: 0x0488ade4,
  public: 0x0488b21e,
});

export interface Options {
  makeIdentifier(input: Uint8Array): Promise<Uint8Array>;
}

export interface Versions {
  private: number;
  public: number;
}

export interface HDKeySnapshot {
  xpriv: string | null;
  xpub: string | null;
}

export class HDKey {
  static get HARDENED_OFFSET() {
    return HARDENED_OFFSET;
  }

  static async fromJSON({ xpriv }: HDKeySnapshot) {
    return xpriv ? this.fromExtendedKey(xpriv) : undefined;
  }

  static async fromMasterSeed(seed: Uint8Array, versions = BITCOIN_VERSIONS, secret = MASTER_SECRET) {
    const signed = await createHMAC(secret, seed);
    const hdkey = new HDKey(versions);
    hdkey.#chainCode = signed.slice(32);
    hdkey.setPrivateKey(signed.slice(0, 32));
    return hdkey;
  }

  static async fromExtendedKey(base58key: string, versions = BITCOIN_VERSIONS) {
    // => version(4) || depth(1) || fingerprint(4) || index(4) || chain(32) || key(33)
    const hdkey = new HDKey(versions);
    const viewKey = new DataView(Uint8Array.from(decode(base58key)).buffer);
    const version = viewKey.getUint32(0);
    if (!(version === versions.private || version === versions.public)) {
      throw new Error('Version mismatch: does not match private or public');
    }
    hdkey.#depth = viewKey.getUint8(4);
    hdkey.#parentFingerprint = viewKey.getUint32(5);
    hdkey.#index = viewKey.getUint32(9);
    hdkey.#chainCode = new Uint8Array(viewKey.buffer.slice(13, 45));

    const key = new Uint8Array(viewKey.buffer.slice(45));
    if (key[0] === 0) {
      if (version !== versions.private) {
        throw new Error('Version mismatch: version does not match private');
      }
      await hdkey.setPrivateKey(key.slice(1));
    } else {
      if (version !== versions.public) {
        throw new Error('Version mismatch: version does not match public');
      }
      await hdkey.setPublicKey(key);
    }
    return hdkey;
  }

  versions: Readonly<Versions>;

  #depth = 0;
  #index = 0;
  #privateKey: Uint8Array | undefined;
  #publicKey: Uint8Array | undefined;
  #chainCode: Uint8Array | undefined;
  #identifier: Uint8Array | undefined;
  #fingerprint = 0;
  #parentFingerprint = 0;

  private makeIdentifier: Options['makeIdentifier'];

  constructor(versions = BITCOIN_VERSIONS, options?: Options) {
    this.makeIdentifier = options?.makeIdentifier ?? hash160;
    this.versions = Object.freeze<Versions>({
      private: versions.private,
      public: versions.public,
    });
  }

  get fingerprint() {
    return this.#fingerprint;
  }

  get parentFingerprint() {
    return this.#parentFingerprint;
  }

  get chainCode() {
    return this.#chainCode ? Uint8Array.from(this.#chainCode) : null;
  }

  get identifier() {
    return this.#identifier ? Uint8Array.from(this.#identifier) : null;
  }

  get depth() {
    return this.#depth;
  }

  get index() {
    return this.#index;
  }

  getPublicKey(extended = false) {
    const key = this.#publicKey;
    if (key === undefined) {
      return null;
    } else if (extended) {
      return this.#serialize('public', key);
    } else {
      return Uint8Array.from(key);
    }
  }

  async setPublicKey(key: Uint8Array) {
    key = Uint8Array.from(key);
    if (!publicKeyVerify(key)) {
      throw new Error('Invalid public key');
    } else {
      this.#privateKey = undefined;
      this.#publicKey = Uint8Array.from(publicKeyConvert(key, true));
      this.#identifier = await this.makeIdentifier(this.#publicKey);
      this.#fingerprint = readUInt32BE(this.#identifier);
    }
  }
  getPrivateKey(extended = false) {
    const key = this.#privateKey;
    if (key === undefined) {
      return undefined;
    } else if (extended) {
      return this.#serialize('private', Uint8Array.of(0, ...key));
    } else {
      return Uint8Array.from(key);
    }
  }

  async setPrivateKey(key: Uint8Array) {
    key = Uint8Array.from(key);
    if (!privateKeyVerify(key)) {
      throw new Error('Invalid private key');
    } else {
      this.#privateKey = key;
      this.#publicKey = Uint8Array.from(publicKeyCreate(key, true));
      this.#identifier = await this.makeIdentifier(this.#publicKey);
      this.#fingerprint = readUInt32BE(this.#identifier);
    }
  }

  async derive(path: string) {
    const entries = path.split(/\//g);
    if (!/^m'?$/.test(entries.shift()!)) {
      throw new Error('Path must start with "m"');
    }
    let key: HDKey = this;
    for (const entry of entries) {
      let childIndex = Number.parseInt(entry, 10);
      if (childIndex > HARDENED_OFFSET) {
        throw new Error('Invalid index');
      } else if (entry.endsWith("'")) {
        childIndex += HARDENED_OFFSET;
      }
      key = await key.deriveChild(childIndex);
    }
    return key;
  }

  private async deriveChild(index: number): Promise<HDKey> {
    if (this.#publicKey === undefined || this.#chainCode === undefined) {
      throw new Error('Could not derive child key');
    }
    let data: Uint8Array;
    if (index >= HARDENED_OFFSET) {
      const key = this.#privateKey;
      if (key === undefined) {
        throw new Error('Could not derive hardened child key');
      }
      // data = 0x00 || ser256(kpar) || ser32(index);
      data = new Uint8Array(1 + key.length + 4);
      data.set(key, 1);
      new DataView(data.buffer).setUint32(key.length + 1, index);
    } else {
      // data = serP(point(kpar)) || ser32(index)
      //      = serP(Kpar) || ser32(index)
      const key = this.#publicKey;
      data = new Uint8Array(key.length + 4);
      data.set(key, 0);
      new DataView(data.buffer).setUint32(key.length, index);
    }
    const signed = await createHMAC(this.#chainCode, data);
    const hdkey = new HDKey(this.versions);
    const IL = signed.slice(0, 32);
    const IR = signed.slice(32);
    if (this.#privateKey) {
      try {
        // Private parent key -> private child key
        // Ki = parse256(IL) + kpar (mod n)
        await hdkey.setPrivateKey(privateKeyTweakAdd(this.#privateKey, IL));
        // throw if IL >= n || (privateKey + IL) === 0
      } catch {
        // In case parse256(IL) >= n or ki == 0, one should proceed with the next value for i
        return this.deriveChild(index + 1);
      }
    } else {
      try {
        // Public parent key -> public child key
        // Ki = point(parse256(IL)) + Kpar
        //    = G*IL + Kpar
        await hdkey.setPublicKey(publicKeyTweakAdd(this.#publicKey, IL, true));
        // throw if IL >= n || (g**IL + publicKey) is infinity
      } catch {
        // In case parse256(IL) >= n or Ki is the point at infinity, one should proceed with the next value for i
        return this.deriveChild(index + 1);
      }
    }
    hdkey.#chainCode = IR;
    hdkey.#depth = this.#depth + 1;
    hdkey.#parentFingerprint = this.#fingerprint;
    hdkey.#index = index;
    return hdkey;
  }

  sign(hash: Uint8Array) {
    const key = this.#privateKey;
    if (key === undefined || !privateKeyVerify(key)) {
      throw new Error('Invalid private key');
    }
    return ecdsaSign(Uint8Array.from(hash), key).signature;
  }

  verify(hash: Uint8Array, signature: Uint8Array) {
    const key = this.#publicKey;
    if (key === undefined || !publicKeyVerify(key)) {
      throw new Error('Invalid public key');
    }
    return ecdsaVerify(Uint8Array.from(signature), Uint8Array.from(hash), key);
  }

  wipePrivateKey() {
    this.#privateKey = undefined;
  }

  toJSON(): HDKeySnapshot {
    const xpriv = this.getPrivateKey(true);
    const xpub = this.getPublicKey(true);
    return {
      xpriv: xpriv ? encode(xpriv) : null,
      xpub: xpub ? encode(xpub) : null,
    };
  }

  #serialize = (version: keyof Versions, key: Uint8Array) => {
    if (this.#chainCode === undefined) {
      throw new Error('chain code unavailable');
    }
    // name           offset
    // version(4)     0
    // depth(1)       4
    // fingerprint(4) 5
    // index(4)       9
    // chain(32)      13
    // key(33)        45
    //                78
    const packed = new Uint8Array(PACKED_LENGTH);
    const view = new DataView(packed.buffer);
    view.setUint32(0, this.versions[version]);
    view.setUint8(4, this.depth);
    view.setUint32(5, this.depth ? this.#parentFingerprint : 0);
    view.setUint32(9, this.index);
    packed.set(this.#chainCode, 13);
    packed.set(key, 45);
    return packed;
  };
}

async function createHMAC(secret: Uint8Array, message: Uint8Array) {
  const usages: KeyUsage[] = ['sign', 'verify'];
  const algorithm: HmacImportParams = { name: 'HMAC', hash: { name: 'SHA-512' } };
  const key = await crypto.subtle.importKey('raw', secret, algorithm, false, usages);
  const hashed = await crypto.subtle.sign(algorithm, key, message);
  return new Uint8Array(hashed);
}

function readUInt32BE(data: Uint8Array, offset = 0) {
  return new DataView(data.buffer).getUint32(offset);
}
