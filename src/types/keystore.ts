import { KeyStore } from '../crypto-suite';
import { CurveType } from './basic';

export interface KeyPair {
  coin: string;
  address: string;
  derivationPath: string;
  curve: CurveType;
  network: string;
  segWit?: string;
  extPubKey?: string; // extended public key
}

export enum KeyStoreSource {
  Mnemonic = 'Mnemonic',
  PrivateKey = 'PrivateKey',
  KeyStore = 'KeyStore',
}

export enum KeyStoreType {
  HDKeyStore = 'HDKeyStore',
  ArweaveKeyStore = 'ArweaveKeyStore',
}

export type KeyStoreSnapshot = KeyStoreSnapshot.Type;

export type KeyStoreSnapshotMarked = KeyStoreSnapshot.Masked;

namespace KeyStoreSnapshot {
  export type Type = Snapshot & (HDSnapshot | ArweaveSnapshot);
  export type Masked = Pick<Type, 'version' | 'type' | 'hash'> & Metadata;

  interface Snapshot {
    hash: string;
    pairs: ReadonlyArray<KeyPair>;
    meta: Readonly<Metadata>;
  }

  interface HDSnapshot {
    version: 1;
    type: KeyStoreType.HDKeyStore;
    crypto: KeyStore;
  }

  interface ArweaveSnapshot {
    version: 1;
    type: KeyStoreType.ArweaveKeyStore;
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
