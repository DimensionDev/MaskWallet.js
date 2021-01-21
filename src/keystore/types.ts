import { KeyStore as EncryptedJSON } from '../crypto-suite/types';

export interface CoinInfo {
  coin: string;
  derivationPath: string;
  curve: CurveType;
  network?: string;
  segWit?: string;
}

export enum SystemKind {
  HDKeyStore = 'HDKeyStore',
  Arweave = 'Arweave',
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

export interface TypedKeyStore {
  // locker
  isLocked(): boolean;
  lock(): void;
  unlock(type: UnlockKeyType.Password, password: string): Promise<boolean>;
  unlock(type: UnlockKeyType.DeriverdKey, key: string): Promise<boolean>;
  // finder
  find(type: KeyType.PublicKey, symbol: string, address: string, path?: string): Promise<unknown>;
  find(type: KeyType.PrivateKey, symbol: string, address: string, path?: string): Promise<unknown>;
  // exporter
  exportMnemonic(): Promise<string>;
  exportPrivateKey(coin: string, mainAddress: string, path?: string): Promise<string>;
  // derive
  deriveKey(info: CoinInfo): Promise<KeyPair>;
  // storage
  toJSON(): Readonly<KeyStore.Snapshot>;
}

export enum UnlockKeyType {
  Password = 'Password',
  DeriverdKey = 'DeriverdKey',
}

export interface KeyPair {
  coin: string;
  address: string;
  derivationPath: string;
  curve: CurveType;
  network: string;
  segWit?: string;
  // extraPublicKey: string;
}

export interface StorageRegistry {
  hashes(): AsyncIterator<KeyStore.Snapshot['hash']>;
  hasHDKeyStore(hash: KeyStore.Snapshot['hash']): Promise<boolean>;
  getHDKeyStore(hash: KeyStore.Snapshot['hash']): Promise<KeyStore.Snapshot | undefined>;
  setHDKeyStore(hash: KeyStore.Snapshot['hash'], snapshot: Readonly<KeyStore.Snapshot>): Promise<void>;
  deleteHDKeyStore(hash: KeyStore.Snapshot['hash']): Promise<KeyStore.Snapshot>;
}

export enum KeyStoreSource {
  Mnemonic = 'Mnemonic',
  PrivateKey = 'PrivateKey',
  EncryptedJSON = 'EncryptedJSON',
}

export namespace KeyStore {
  interface PayloadMapping {
    keystore: EncryptedJSON;
  }

  export interface Snapshot<T extends keyof PayloadMapping = keyof PayloadMapping> {
    version: 1;

    hash: string;

    format: T;
    payload: Readonly<PayloadMapping[T]>;

    metadata: Metadata;
  }

  export interface Metadata {
    name: string;
    source: KeyStoreSource;
    timestamp: Date;
    remark?: string;

    passwordHint: string;
  }
}

export type CreateKeyStoreParams = CreateKeyStoreParams.Type;

export namespace CreateKeyStoreParams {
  export type Type = HDKeyStore;

  export interface HDKeyStore {
    type: KeyStoreSource.Mnemonic;
    name?: string;
    password: string;
    passwordHint?: string;
  }
}

export interface CreateKeyStoreResult {
  kind: SystemKind.HDKeyStore;
  name: string;
  source: KeyStoreSource;
  pairs: unknown[];
  createdAt: Date;
}

export type ImportKeyStoreParams = ImportKeyStoreParams.Type;

export namespace ImportKeyStoreParams {
  export type Type = Mnemonic | JSON | PrivateKey;

  interface Generanl {
    kind: SystemKind.HDKeyStore;
    name: string;
    overwrite: boolean;
    password: string;
    passwordHint?: string;
  }

  export interface Mnemonic extends Generanl {
    type: KeyStoreSource.Mnemonic;
    mnemonic: string;
  }

  export interface JSON extends Generanl {
    type: KeyStoreSource.EncryptedJSON;
    payload: EncryptedJSON;
  }

  export interface PrivateKey extends Generanl {
    type: KeyStoreSource.PrivateKey;
    privateKey: string;
  }
}

export type ExportKeyStoreParams = ExportKeyStoreParams.Type;

export namespace ExportKeyStoreParams {
  export type Type = Mnemonic | PrivateKey;

  interface Generanl {
    kind: SystemKind.HDKeyStore;
    hash: KeyStore.Snapshot['hash'];
    password: string;
  }

  export interface Mnemonic extends Generanl {
    type: KeyStoreSource.Mnemonic;
    mnemonic: string;
  }

  export interface PrivateKey extends Generanl {
    type: KeyStoreSource.PrivateKey;
    chainType: ChainType;
    network: string;
  }
}

export type SignParams = SignParams.Type;

export namespace SignParams {
  export interface Type {
    hash: KeyStore.Snapshot['hash'];
    chainType: ChainType;
    address: string;
    unlockKeyType: UnlockKeyType;
    input: unknown;
  }
}
