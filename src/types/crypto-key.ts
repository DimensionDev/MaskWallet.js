import { CurveType } from './basic';

export type CryptoKey = PublicKey | PrivateKey;

export class PublicKey {
  public readonly curve: CurveType;
  public readonly deterministic: boolean;

  constructor(curve: CurveType) {
    this.curve = curve;
    this.deterministic = false;
  }

  derive(path: string) {
    return;
  }
}

export class SEPC256kPublicKey extends PublicKey {
  constructor(data: string) {
    super(CurveType.SECP256k1);
    Object.freeze(this);
  }
}

export class SubSr25519PublicKey extends PublicKey {
  constructor(data: string) {
    super(CurveType.SubSr25519);
    Object.freeze(this);
  }
}

export class PrivateKey {
  public readonly curve: CurveType;
  public readonly deterministic: boolean;

  static fromSeed(seed: string): PrivateKey {
    throw new Error('not implemented');
  }

  static fromMnemonic(seed: string): PrivateKey {
    throw new Error('not implemented');
  }

  constructor(curve: CurveType) {
    this.curve = curve;
    this.deterministic = false;
    Object.freeze(this);
  }

  getPublicKey(): PublicKey {
    throw new Error('not implemented');
  }

  sign(data: string): string {
    throw new Error('not implemented');
  }

  signRecoverable(data: string): string {
    throw new Error('not implemented');
  }
}

export class SEPC256kPrivateKey extends PrivateKey {
  constructor(data: string) {
    super(CurveType.SECP256k1);
    Object.freeze(this);
  }
}

export class SubSr25519PrivateKey extends PrivateKey {
  constructor(data: string) {
    super(CurveType.SubSr25519);
    Object.freeze(this);
  }
}
