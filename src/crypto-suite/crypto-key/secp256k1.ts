import { CurveType } from 'types';
import { DeterministicPrivateKey, DeterministicPublicKey } from './types';

export class SECP256k1PublicKey implements DeterministicPublicKey {
  curve = CurveType.SECP256k1;

  constructor() {
    Object.freeze(this);
  }

  derive(path: string): this {
    throw new Error('Method not implemented.');
  }

  get [Symbol.toStringTag]() {
    return 'SECP256k1PublicKey';
  }
}

export class SECP256k1PrivateKey implements DeterministicPrivateKey {
  curve = CurveType.SECP256k1;

  constructor() {
    Object.freeze(this);
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

  get [Symbol.toStringTag]() {
    return 'SECP256k1PrivateKey';
  }
}
