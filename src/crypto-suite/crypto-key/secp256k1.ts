import { BIP32Interface, fromSeed } from 'bip32';
import { mnemonicToSeed, validateMnemonic } from 'bip39';
import { publicKeyCreate } from 'secp256k1';
import { CurveType } from '../../types';
import { DeterministicPrivateKey, DeterministicPublicKey } from './types';

export class SECP256k1PublicKey extends DeterministicPublicKey {
  constructor(key: string | Uint8Array) {
    super(CurveType.SECP256k1);
  }

  derivePath(path: string): this {
    throw new Error('Method not implemented.');
  }

  toString(): string {
    throw new Error('Method not implemented.');
  }
}

export class SECP256k1PrivateKey extends DeterministicPrivateKey {
  #key: Buffer;

  static async fromSeed(path: string, seed: Buffer): Promise<SECP256k1PrivateKey> {
    return new this(deriveKeyPair(fromSeed(seed), path));
  }

  static async fromMnemonic(path: string, mnemonic: string): Promise<SECP256k1PrivateKey> {
    return new this(deriveKeyPair(await deriveMasterKey(mnemonic), path));
  }

  private constructor(key: Buffer) {
    super(CurveType.SECP256k1);
    this.#key = key;
    Object.freeze(this);
  }

  getPublicKey(): SECP256k1PublicKey {
    return new SECP256k1PublicKey(publicKeyCreate(this.#key, true));
  }

  derivePath(path: string): this {
    throw new Error('Method not implemented.');
  }

  async sign(data: Uint8Array): Promise<Uint8Array> {
    throw new Error('Method not implemented.');
  }

  async signRecoverable(data: Uint8Array): Promise<Uint8Array> {
    throw new Error('Method not implemented.');
  }

  toString(): string {
    return this.#key.toString('hex');
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
