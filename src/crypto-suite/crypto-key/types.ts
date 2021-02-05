import { CurveType } from '../../types';

export type CryptoKey = PublicKey | PrivateKey;

export abstract class PublicKey {
  abstract get [Symbol.toStringTag](): string;
  /** Base58 / SS58 encoded */
  abstract toString(): string;
}

export abstract class PrivateKey extends PublicKey {
  abstract getPublicKey(): PublicKey;
  abstract sign(data: Uint8Array): Promise<Uint8Array>;
  abstract signRecoverable(data: Uint8Array): Promise<Uint8Array>;
}

export abstract class DeterministicPublicKey extends PublicKey {
  readonly curve: CurveType;

  constructor(curve: CurveType) {
    super();
    this.curve = curve;
  }

  abstract derivePath(path: string): this;

  get [Symbol.toStringTag]() {
    return `${this.curve}PublicKey`;
  }
}

export abstract class DeterministicPrivateKey extends PrivateKey implements DeterministicPublicKey {
  static fromSeed(path: string, seed: Buffer): Promise<DeterministicPrivateKey> {
    throw new Error('The Method not implemented.');
  }

  static fromMnemonic(path: string, mnemonic: string): Promise<DeterministicPrivateKey> {
    throw new Error('The Method not implemented.');
  }

  readonly curve: CurveType;

  constructor(curve: CurveType) {
    super();
    this.curve = curve;
  }

  abstract getPublicKey(): DeterministicPublicKey;
  abstract derivePath(path: string): this;

  get [Symbol.toStringTag]() {
    return `${this.curve}PrivateKey`;
  }
}

export function isPublicKey(key: object, deterministic?: false): key is PublicKey;
export function isPublicKey(key: object, deterministic: true): key is DeterministicPublicKey;
export function isPublicKey(key: object, deterministic = false) {
  return deterministic ? key instanceof DeterministicPublicKey : key instanceof PublicKey;
}

export function isPrivateKey(key: object, deterministic?: false): key is PrivateKey;
export function isPrivateKey(key: object, deterministic: true): key is DeterministicPrivateKey;
export function isPrivateKey(key: object, deterministic = false) {
  return deterministic ? key instanceof DeterministicPrivateKey : key instanceof PrivateKey;
}
