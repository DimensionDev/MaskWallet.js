import { KeyStore } from 'crypto-suite/types';
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

export type KeyStoreSnapshot = KeyStoreSnapshot.Type;

export type KeyStoreSnapshotMarked = KeyStoreSnapshot.Masked;

namespace KeyStoreSnapshot {
  export type Type = Snapshot & { type: 'hd'; crypto: KeyStore };

  export interface Masked extends Metadata {
    version: Snapshot['version'];
    type: Snapshot['type'];
    hash: Snapshot['hash'];
  }

  interface Snapshot {
    version: 1;
    type: 'hd';
    hash: string;
    pairs: ReadonlyArray<KeyPair>;
    meta: Readonly<Metadata>;
  }

  interface Metadata {
    name: string;
    source: KeyStoreSource;
    timestamp: Date;
    remark?: string;
    passwordHint?: string;
  }
}
