import { KeyStore } from 'crypto-suite/types';

export interface CoinInfo {
  coin: string;
  derivationPath: string;
  curve: CurveType;
  network?: string;
  segWit?: string;
}

export enum ChainType {
  Ethereum = 'Ethereum',
  BitcoinCash = 'BitcoinCash',
  Substrate = 'Substrate',
}

export enum CurveType {
  /** secp256k1 */
  SECP256k1 = 'SECP256k1',
  /** ed25519 */
  ED25519 = 'ED25519',
  /** ed25519-blake2b-nano */
  ED25519Blake2bNano = 'ED25519Blake2bNano',
  /** SubSr25519 */
  SubSr25519 = 'SubSr25519',
  /** curve25519 */
  Curve25519 = 'Curve25519',
  /** nist256p1 */
  NIST256p1 = 'NIST256p1',
}

export enum KeyType {
  Mnemonic = 'Mnemonic',
  PrivateKey = 'PrivateKey',
  PublicKey = 'PublicKey',
}

export interface KeyPair {
  coin: string;
  address: string;
  derivationPath: string;
  curve: CurveType;
  network: string;
  segWit?: string;
  extPubKey?: string; // extended public key
}

export enum UnlockKeyType {
  Password = 'Password',
  DeriverdKey = 'DeriverdKey',
}

export interface StorageRegistry {
  hashes(): AsyncIterator<KeyStoreSnapshot['hash']>;
  hasHDKeyStore(hash: KeyStoreSnapshot['hash']): Promise<boolean>;
  getHDKeyStore(hash: KeyStoreSnapshot['hash']): Promise<KeyStoreSnapshot | undefined>;
  setHDKeyStore(hash: KeyStoreSnapshot['hash'], snapshot: Readonly<KeyStoreSnapshot>): Promise<void>;
  deleteHDKeyStore(hash: KeyStoreSnapshot['hash']): Promise<KeyStoreSnapshot>;
}

export enum KeyStoreSource {
  Mnemonic = 'Mnemonic',
  PrivateKey = 'PrivateKey',
  EncryptedJSON = 'EncryptedJSON',
}

export type KeyStoreSnapshot = KeyStoreSnapshot.Type;

namespace KeyStoreSnapshot {
  export type Type = Snapshot & { type: 'hd'; crypto: KeyStore };

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

export type CreateKeyStoreParams = CreateKeyStoreParams.Type;

export namespace CreateKeyStoreParams {
  export type Type = HDKeyStore;

  export interface HDKeyStore {
    type: 'hd';
    source: KeyStoreSource.Mnemonic;
    name?: string;
    password: string;
    passwordHint?: string;
  }
}

export interface CreateKeyStoreResult {
  type: 'hd';
  name: string;
  source: KeyStoreSource;
  pairs: unknown[];
  createdAt: Date;
}

export type ImportKeyStoreParams = ImportKeyStoreParams.Type;

export namespace ImportKeyStoreParams {
  export type Type = Mnemonic | JSON | PrivateKey;

  interface Generanl {
    type: 'hd';
    name: string;
    overwrite: boolean;
    password: string;
    passwordHint?: string;
  }

  export interface Mnemonic extends Generanl {
    source: KeyStoreSource.Mnemonic;
    mnemonic: string;
  }

  export interface JSON extends Generanl {
    source: KeyStoreSource.EncryptedJSON;
    payload: KeyStore;
  }

  export interface PrivateKey extends Generanl {
    source: KeyStoreSource.PrivateKey;
    privateKey: string;
  }
}

export type ExportKeyStoreParams = ExportKeyStoreParams.Type;

export namespace ExportKeyStoreParams {
  export type Type = Mnemonic | PrivateKey;

  interface Generanl {
    type: 'hd';
    hash: KeyStoreSnapshot['hash'];
    password: string;
  }

  export interface Mnemonic extends Generanl {
    source: KeyStoreSource.Mnemonic;
    mnemonic: string;
  }

  export interface PrivateKey extends Generanl {
    source: KeyStoreSource.PrivateKey;
    chainType: ChainType;
    network: string;
  }
}

export type SignParams = SignParams.Type;

export namespace SignParams {
  export interface Type {
    hash: KeyStoreSnapshot['hash'];
    chainType: ChainType;
    address: string;
    unlockKeyType: UnlockKeyType;
    input: unknown;
  }
}
