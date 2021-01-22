import { CurveType } from 'types';

export type CryptoKey = PublicKey | PrivateKey;

export interface PublicKey {
  readonly curve: CurveType;
  [Symbol.toStringTag]: string;
}

export interface DeterministicPublicKey extends PublicKey {
  derive(path: string): this;
}

export interface PrivateKey extends PublicKey {
  readonly curve: CurveType;
  getPublicKey(): PublicKey;
  sign(data: Uint8Array): string;
  signRecoverable(data: Uint8Array): string;
  [Symbol.toStringTag]: string;
}

export interface DeterministicPrivateKey extends PrivateKey, DeterministicPublicKey {
  getPublicKey(): DeterministicPublicKey;
  derive(path: string): this;
}

export class SECP256k1PublicKey implements DeterministicPublicKey {
  curve = CurveType.SECP256k1;
  [Symbol.toStringTag] = 'SECP256k1PublicKey';

  constructor() {
    Object.freeze(this);
  }

  derive(path: string): this {
    throw new Error('Method not implemented.');
  }
}

export class SECP256k1PrivateKey implements DeterministicPrivateKey {
  curve = CurveType.SECP256k1;
  [Symbol.toStringTag] = 'SECP256k1PrivateKey';

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
}
