import { CurveType } from 'types';
import { DeterministicPrivateKey, DeterministicPublicKey } from './types';

export class SECP256k1PublicKey extends DeterministicPublicKey {
  derive(path: string): this {
    throw new Error('Method not implemented.');
  }

  toString(): string {
    throw new Error('Method not implemented.');
  }

  get curve() {
    return CurveType.SECP256k1;
  }

  get [Symbol.toStringTag]() {
    return 'SECP256k1PublicKey';
  }
}

export class SECP256k1PrivateKey extends DeterministicPrivateKey {
  static fromSeed(seed: string): SECP256k1PrivateKey {
    throw new Error('The Method not implemented.');
  }

  static fromMnemonic(mnemonic: string): SECP256k1PrivateKey {
    throw new Error('The Method not implemented.');
  }

  getPublicKey(): SECP256k1PublicKey {
    throw new Error('Method not implemented.');
  }

  derive(path: string): this {
    throw new Error('Method not implemented.');
  }

  sign(data: Uint8Array): string {
    throw new Error('Method not implemented.');
  }

  signRecoverable(data: Uint8Array): string {
    throw new Error('Method not implemented.');
  }

  toString(): string {
    throw new Error('Method not implemented.');
  }

  get curve() {
    return CurveType.SECP256k1;
  }

  get [Symbol.toStringTag]() {
    return 'SECP256k1PrivateKey';
  }
}
