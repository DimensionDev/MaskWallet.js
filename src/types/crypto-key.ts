import { CurveType } from './basic';

export type CryptoKey = PublicKey | PrivateKey;

export abstract class PublicKey {
  public readonly curve: CurveType;

  constructor(curve: CurveType) {
    this.curve = curve;
  }

  abstract derive(path: string): this;

  abstract get deterministic(): boolean;
}

export class SEPC256kPublicKey extends PublicKey {
  constructor(data: string) {
    super(CurveType.SECP256k1);
    Object.freeze(this);
  }

  derive(path: string): this {
    throw new Error('Method not implemented.');
  }

  get deterministic(): boolean {
    return false;
  }
}

export class SubSr25519PublicKey extends PublicKey {
  constructor(data: string) {
    super(CurveType.SubSr25519);
    Object.freeze(this);
  }

  derive(path: string): this {
    throw new Error('Method not implemented.');
  }

  get deterministic(): boolean {
    return false;
  }
}

export abstract class PrivateKey {
  public readonly curve: CurveType;

  static fromSeed(seed: string): PrivateKey {
    throw new Error('not implemented');
  }

  static fromMnemonic(mnemonic: string): PrivateKey {
    throw new Error('not implemented');
  }

  constructor(curve: CurveType) {
    this.curve = curve;
    Object.freeze(this);
  }

  abstract get deterministic(): boolean;

  abstract get publicKey(): PublicKey;

  abstract sign(data: string): string;

  abstract signRecoverable(data: string): string;
}

export class SEPC256kPrivateKey extends PrivateKey {
  constructor(data: string) {
    super(CurveType.SECP256k1);
    Object.freeze(this);
  }

  get deterministic(): boolean {
    return false;
  }

  get publicKey(): PublicKey {
    throw new Error('Method not implemented.');
  }

  sign(data: string): string {
    throw new Error('Method not implemented.');
  }

  signRecoverable(data: string): string {
    throw new Error('Method not implemented.');
  }
}

export class SubSr25519PrivateKey extends PrivateKey {
  constructor(data: string) {
    super(CurveType.SubSr25519);
    Object.freeze(this);
  }

  get deterministic(): boolean {
    return false;
  }

  get publicKey(): PublicKey {
    throw new Error('Method not implemented.');
  }

  sign(data: string): string {
    throw new Error('Method not implemented.');
  }

  signRecoverable(data: string): string {
    throw new Error('Method not implemented.');
  }
}
