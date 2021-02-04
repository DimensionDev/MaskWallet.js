import { BIP32Interface, fromSeed } from 'bip32';
import { mnemonicToSeed, validateMnemonic } from 'bip39';
import { sha256 } from 'crypto-suite/algorithm';
import { ec as Elliptic } from 'elliptic';
import { ecdsaSign, publicKeyCreate } from 'secp256k1';
import { CurveType } from 'types';
import { DeterministicPrivateKey, DeterministicPublicKey } from './types';

export class SECP256k1PublicKey extends DeterministicPublicKey {
  #key: Elliptic.KeyPair;

  constructor(key: string | Uint8Array) {
    super();
    const ec = new Elliptic('secp256k1');
    this.#key = ec.keyFromPublic(key);
  }

  derive(path: string): this {
    this.#key.derive(this.#key.ec.curve);
    return this;
  }

  /** hex encoded */
  toString(): string {
    return this.#key.getPublic().encode('hex', true);
  }

  get curve() {
    return CurveType.SECP256k1;
  }

  get [Symbol.toStringTag]() {
    return 'SECP256k1PublicKey';
  }
}

export class SECP256k1PrivateKey extends DeterministicPrivateKey {
  #key: Buffer;

  static async fromSeed(path: string, seed: string): Promise<SECP256k1PrivateKey> {
    throw new Error('The Method not implemented.');
  }

  static async fromMnemonic(path: string, mnemonic: string): Promise<SECP256k1PrivateKey> {
    return new this(deriveKeyPair(await deriveMasterKey(mnemonic), path));
  }

  private constructor(key: Buffer) {
    super();
    this.#key = key;
  }

  getPublicKey(): SECP256k1PublicKey {
    return new SECP256k1PublicKey(publicKeyCreate(this.#key, true));
  }

  derive(path: string): this {
    throw new Error('Method not implemented.');
  }

  async sign(data: Uint8Array): Promise<Uint8Array> {
    const message = new Uint8Array(await sha256(data));
    return ecdsaSign(message, this.#key).signature;
  }

  async signRecoverable(data: Uint8Array): Promise<Uint8Array> {
    throw new Error('Method not implemented.');
  }

  /** hex encoded */
  toString(): string {
    return this.#key.toString('hex');
  }

  get curve() {
    return CurveType.SECP256k1;
  }

  get [Symbol.toStringTag]() {
    return 'SECP256k1PrivateKey';
  }
}

async function deriveMasterKey(mnemonic: string): Promise<BIP32Interface> {
  validateMnemonic(mnemonic);
  return fromSeed(await mnemonicToSeed(mnemonic));
}

function deriveKeyPair(masterKey: BIP32Interface, path: string) {
  const hd = masterKey.derivePath(path);
  if (hd.privateKey === undefined) {
    throw new Error('derive private key failed');
  }
  return hd.privateKey;
}
