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
  abstract get curve(): CurveType;
  abstract derive(path: string): this;
}

export abstract class DeterministicPrivateKey extends PrivateKey implements DeterministicPublicKey {
  static fromSeed(path: string, seed: string): Promise<DeterministicPrivateKey> {
    throw new Error('The Method not implemented.');
  }

  static fromMnemonic(path: string, mnemonic: string): Promise<DeterministicPrivateKey> {
    throw new Error('The Method not implemented.');
  }

  abstract get curve(): CurveType;
  abstract getPublicKey(): DeterministicPublicKey;
  abstract derive(path: string): this;
}
