import { decode, encode } from 'bs58check';
import { ecdsaSign, ecdsaVerify, privateKeyTweakAdd, privateKeyVerify, publicKeyConvert, publicKeyCreate, publicKeyTweakAdd, publicKeyVerify } from 'secp256k1';
import crypto from '../crypto-suite/driver';
import RIPEMD160 from 'ripemd160';

// UTF8 Encoded: 'Bitcoin seed'
const MASTER_SECRET = Uint8Array.of(66, 105, 116, 99, 111, 105, 110, 32, 115, 101, 101, 100);
const HARDENED_OFFSET = 0x80000000;
const PACKED_LENGTH = 78;
// Bitcoin hardcoded by default, can use package `coininfo` for others
const BITCOIN_VERSIONS: Versions = {
  private: 0x0488ade4,
  public: 0x0488b21e,
};

export interface Versions {
  private: number;
  public: number;
}

export class HDKey {
  static readonly HARDENED_OFFSET = HARDENED_OFFSET;

  static fromJSON({ xpriv }: ReturnType<HDKey['toJSON']>) {
    return this.fromExtendedKey(xpriv);
  }

  static async fromMasterSeed(seed: Uint8Array, versions = BITCOIN_VERSIONS) {
    const signed = await createHMAC(MASTER_SECRET, seed);
    const hdkey = new HDKey(versions);
    hdkey.#chainCode = new Uint8Array(signed.slice(32));
    hdkey.setPrivateKey(new Uint8Array(signed.slice(0, 32)));
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
  #privateKey = Uint8Array.of();
  #publicKey = Uint8Array.of();
  #chainCode = Uint8Array.of();
  #fingerprint = 0;
  #parentFingerprint = 0;
  #identifier = Uint8Array.of();

  constructor(versions = BITCOIN_VERSIONS) {
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
    return Uint8Array.from(this.#chainCode);
  }

  get identifier() {
    return Uint8Array.from(this.#identifier);
  }

  get pubKeyHash() {
    return this.identifier;
  }

  get depth() {
    return this.#depth;
  }

  get index() {
    return this.#index;
  }

  getPrivateKey(extended = false) {
    if (extended) {
      return this.#serialize('private', Uint8Array.of(0, ...this.#privateKey));
    }
    return Uint8Array.from(this.#privateKey);
  }

  async setPrivateKey(value: Uint8Array) {
    if (value === undefined) {
      this.#privateKey = value;
    } else if (value.length !== 32) {
      throw new Error('Private key must be 32 bytes');
    } else if (!privateKeyVerify(value)) {
      throw new Error('Invalid private key');
    } else {
      this.#privateKey = value;
      this.#publicKey = publicKeyCreate(value, true);
      this.#identifier = await hash160(this.#publicKey);
      this.#fingerprint = readUInt32BE(this.#identifier);
    }
  }

  getPublicKey(extended = false) {
    if (extended) {
      return this.#serialize('public', this.#publicKey);
    }
    return Uint8Array.from(this.#publicKey);
  }

  async setPublicKey(value: Uint8Array) {
    if (value === undefined) {
      this.#publicKey = value;
    } else if (!(value.length === 33 || value.length === 65)) {
      throw new Error('Public key must be 33 or 65 bytes.');
    } else if (!publicKeyVerify(value)) {
      throw new Error('Invalid public key.');
    } else {
      this.#privateKey = Uint8Array.of();
      this.#publicKey = publicKeyConvert(value, true);
      this.#identifier = await hash160(this.#publicKey);
      this.#fingerprint = readUInt32BE(this.#identifier);
    }
  }

  #serialize = (version: keyof Versions, key: Uint8Array) => {
    // => version(4) || depth(1) || fingerprint(4) || index(4) || chain(32) || key(33)
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

  async derive(path: string) {
    if (/^m'?$/.test(path)) {
      return this;
    } else if (!/^m'?\//.test(path)) {
      throw new Error('Path must start with "m"');
    }
    let key: HDKey = this;
    for (const entry of path.split(/\//g).slice(1)) {
      const match = /(\d+)('?)/.exec(entry);
      if (match === null) {
        throw new Error('Invalid entry');
      }
      const childIndex = Number.parseInt(match[1], 10);
      if (childIndex > HARDENED_OFFSET) {
        throw new Error('Invalid index');
      }
      key = await key.deriveChild(match[2] === "'" ? childIndex + HARDENED_OFFSET : childIndex);
    }
    return key;
  }

  private async deriveChild(index: number): Promise<HDKey> {
    const isHardened = index >= HARDENED_OFFSET;
    const indexBuffer = new Uint8Array(4);
    new DataView(indexBuffer.buffer).setUint32(0, index);
    let data: Uint8Array;
    if (isHardened) {
      if (this.#privateKey.length === 0) {
        throw new Error('Could not derive hardened child key');
      }
      // data = 0x00 || ser256(kpar) || ser32(index)
      data = Uint8Array.of(0, ...this.#privateKey, ...indexBuffer);
    } else {
      // data = serP(point(kpar)) || ser32(index)
      //      = serP(Kpar) || ser32(index)
      data = Uint8Array.of(...this.#publicKey, ...indexBuffer);
    }
    const signed = await createHMAC(this.#chainCode, data);
    const hdkey = new HDKey(this.versions);
    const tweak = new Uint8Array(signed.slice(0, 32));
    const chainCode = new Uint8Array(signed.slice(32));
    // Private parent key -> private child key
    if (this.#privateKey.length > 0) {
      // ki = parse256(IL) + kpar (mod n)
      try {
        hdkey.#privateKey = privateKeyTweakAdd(this.#privateKey, tweak);
        // throw if IL >= n || (privateKey + IL) === 0
      } catch {
        // In case parse256(IL) >= n or ki == 0, one should proceed with the next value for i
        return this.deriveChild(index + 1);
      }
      // Public parent key -> public child key
    } else {
      // Ki = point(parse256(IL)) + Kpar
      //    = G*IL + Kpar
      try {
        hdkey.#publicKey = publicKeyTweakAdd(this.#publicKey, tweak, true);
        // throw if IL >= n || (g**IL + publicKey) is infinity
      } catch {
        // In case parse256(IL) >= n or Ki is the point at infinity, one should proceed with the next value for i
        return this.deriveChild(index + 1);
      }
    }
    hdkey.#chainCode = chainCode;
    hdkey.#depth += 1;
    hdkey.#parentFingerprint = this.#fingerprint;
    hdkey.#index = index;
    return hdkey;
  }

  sign(hash: Uint8Array) {
    return ecdsaSign(hash, this.getPrivateKey()).signature;
  }

  verify(hash: Uint8Array, signature: Uint8Array) {
    return ecdsaVerify(hash, signature, this.getPublicKey());
  }

  wipePrivateKey() {
    this.#privateKey = Uint8Array.of();
  }

  toJSON() {
    return {
      xpriv: encode(this.getPrivateKey(true)),
      xpub: encode(this.getPublicKey(true)),
    };
  }
}

async function createHMAC(userKey: Uint8Array, message: Uint8Array) {
  const usages: KeyUsage[] = ['sign', 'verify'];
  const algorithm: HmacImportParams = { name: 'HMAC', hash: { name: 'SHA-512' } };
  const key = await crypto.subtle.importKey('raw', userKey, algorithm, false, usages);
  const hashed = await crypto.subtle.sign(algorithm, key, message);
  return new Uint8Array(hashed);
}

function readUInt32BE(data: Uint8Array, offset = 0) {
  return new DataView(data.buffer).getUint32(offset);
}

async function hash160(input: Uint8Array) {
  // fn(input) = ripemd160(sha256(input))
  const sha256 = await crypto.subtle.digest('SHA-256', input);
  const hashed = new RIPEMD160().update(Buffer.from(sha256)).digest();
  return Uint8Array.from(hashed);
}
