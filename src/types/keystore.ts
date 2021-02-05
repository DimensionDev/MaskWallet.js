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

export type KeyStoreSnapshot = KeyStoreSnapshot.Type;

export type KeyStoreSnapshotMasked = KeyStoreSnapshot.Masked;

namespace KeyStoreSnapshot {
  export type Type = HDSnapshot | PrivateKeySnapshot;
  export type Masked = Pick<Type, 'version' | 'type' | 'hash'> & Metadata;

  interface BaseSnapshot {
    hash: string;
    pairs: ReadonlyArray<KeyPair>;
    meta: Readonly<Metadata>;
  }

  interface HDSnapshot extends BaseSnapshot {
    version: 1;
    type: KeyStoreType.HD;
    crypto: KeyStore;
  }

  interface PrivateKeySnapshot extends BaseSnapshot {
    version: 1;
    type: KeyStoreType.PrivateKey;
    key: JsonWebKey;
  }

  interface Metadata {
    name: string;
    source: KeyStoreSource;
    timestamp: Date;
    remark?: string;
    passwordHint?: string;
  }
}
