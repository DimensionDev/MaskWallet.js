import { CurveType } from 'types';

export type CryptoKey = PublicKey | PrivateKey;

export interface PublicKey {
  readonly curve: CurveType;
}

export interface DeterministicPublicKey extends PublicKey {
  derive(path: string): this;
}

export interface PrivateKey extends PublicKey {
  readonly curve: CurveType;
  getPublicKey(): PublicKey;
  sign(data: Uint8Array): string;
  signRecoverable(data: Uint8Array): string;
}

export interface DeterministicPrivateKey extends PrivateKey, DeterministicPublicKey {
  getPublicKey(): DeterministicPublicKey;
  derive(path: string): this;
}
