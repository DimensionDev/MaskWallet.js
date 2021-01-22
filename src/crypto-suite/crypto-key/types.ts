import { CurveType } from 'types';

export type CryptoKey = PublicKey | PrivateKey;

export interface PublicKey {
  curve: CurveType;
}

export interface PrivateKey extends PublicKey {
  curve: CurveType;
  getPublicKey(): PublicKey;
  sign(data: Uint8Array): string;
  signRecoverable(data: Uint8Array): string;
}

export interface DeterministicPublicKey extends PublicKey {
  derive(path: string): this;
}

export interface DeterministicPrivateKey extends PrivateKey, DeterministicPublicKey {
  getPublicKey(): DeterministicPublicKey;
  derive(path: string): this;
}
