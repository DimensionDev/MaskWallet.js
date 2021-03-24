import { KeyStore } from '../crypto-suite';
import { CurveType } from './basic';
import { ChainType } from './wallet';

export interface KeyPair {
  chainType: ChainType;
  address: string;
  derivationPath?: string;
  curve?: CurveType;
  network?: string;
  segWit?: string;
  extendedPublicKey?: string;
}

export const enum KeyStoreSource {
  Mnemonic = 'Mnemonic',
  PrivateKey = 'PrivateKey',
  KeyStore = 'KeyStore',
}

export const enum KeyStoreType {
  HD = 'HD',
  PrivateKey = 'PrivateKey',
}

export type KeyStoreSnapshot = KeyStoreSnapshot.HD | KeyStoreSnapshot.PrivateKey;

export type KeyStoreSnapshotMasked = Pick<KeyStoreSnapshot, 'version' | 'type' | 'hash'> & KeyStoreSnapshot.Metadata;

export function isHDSnapshot(value: unknown): value is KeyStoreSnapshot.HD {
  return (value as KeyStoreSnapshot)?.type === KeyStoreType.HD;
}

export function isPrivateKeySnapshot(value: unknown): value is KeyStoreSnapshot.PrivateKey {
  return (value as KeyStoreSnapshot)?.type === KeyStoreType.PrivateKey;
}

export namespace KeyStoreSnapshot {
  interface BaseSnapshot {
    hash: string;
    pairs: KeyPair[];
    meta: Metadata;
  }

  export interface HD extends BaseSnapshot {
    version: 1;
    type: KeyStoreType.HD;
    crypto: KeyStore;
  }

  export interface PrivateKey extends BaseSnapshot {
    version: 1;
    type: KeyStoreType.PrivateKey;
    key: JsonWebKey;
  }

  export interface Metadata {
    name: string;
    source: KeyStoreSource;
    timestamp: Date;
    remark?: string;
    passwordHint?: string;
  }
}
