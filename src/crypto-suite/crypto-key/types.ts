import { CurveType } from '../../types';

export type CryptoKey = PublicKey | PrivateKey<unknown, never>;

export abstract class PublicKey {
  private readonly tag: string;

  constructor(tag: string) {
    this.tag = tag;
  }

  abstract toString(): string;

  get [Symbol.toStringTag]() {
    return this.tag;
  }
}

export abstract class PrivateKey<T, R> extends PublicKey {
  abstract getPublicKey(): PublicKey;
  abstract sign(data: T): Promise<R>;
  abstract signRecoverable(data: T): Promise<R>;
}

export abstract class DeterministicPublicKey extends PublicKey {
  readonly curve: CurveType;

  constructor(curve: CurveType) {
    super(`${curve}PublicKey`);
    this.curve = curve;
  }

  abstract derivePath(path: string): this;
}

export abstract class DeterministicPrivateKey extends PrivateKey<Uint8Array, Uint8Array> implements DeterministicPublicKey {
  static fromSeed(path: string, seed: Buffer): Promise<DeterministicPrivateKey> {
    throw new Error('The Method not implemented.');
  }

  static fromMnemonic(path: string, mnemonic: string): Promise<DeterministicPrivateKey> {
    throw new Error('The Method not implemented.');
  }

  readonly curve: CurveType;

  constructor(curve: CurveType) {
    super(`${curve}PrivateKey`);
    this.curve = curve;
  }

  abstract getPublicKey(): DeterministicPublicKey;
  abstract derivePath(path: string): this;
}

export function isPublicKey(key: object): key is PublicKey;
export function isPublicKey(key: object, deterministic: true): key is DeterministicPublicKey;
export function isPublicKey(key: object, deterministic = false) {
  return deterministic ? key instanceof DeterministicPublicKey : key instanceof PublicKey;
}

export function isPrivateKey<T, R>(key: object): key is PrivateKey<T, R>;
export function isPrivateKey(key: object, deterministic: true): key is DeterministicPrivateKey;
export function isPrivateKey(key: object, deterministic = false) {
  return deterministic ? key instanceof DeterministicPrivateKey : key instanceof PrivateKey;
}
