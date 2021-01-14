export interface CoinInfo {
  coin: string;
  derivationPath: string;
  curve: CurveType;
  network?: NetworkType;
  segWit?: string;
}

export enum ChainType {
  Ethereum = 'Ethereum',
  BitcoinCash = 'BitcoinCash',
  Substrate = 'Substrate',
}

export enum NetworkType {
  MainNet = 'MainNet',
  TestNet = 'TestNet',
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
}

export enum UnlockKeyType {
  Password = 'Password',
  DeriverdKey = 'DeriverdKey',
}

export interface StorageRegistry {
  hashes(): Promise<Array<KeyStore.Snapshot['hash']>>;
  hasKeyStore(hash: KeyStore.Snapshot['hash']): Promise<boolean>;
  getKeyStore(hash: KeyStore.Snapshot['hash']): Promise<KeyStore.Snapshot | undefined>;
  setKeyStore(snapshot: Readonly<KeyStore.Snapshot>): Promise<void>;
  deleteKeyStore(hash: KeyStore.Snapshot['hash']): Promise<KeyStore.Snapshot>;
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
    hash: string;

    format: T;
    version: number;
    payload: PayloadMapping[T];

    metadata: Metadata;
  }

  export interface Metadata {
    name: string;
    source: KeyStoreSource;
    timestamp: Date;
    remark?: string;

    passwordHint: string;
  }

  export interface EncryptedJSON {
    cipher: string;
    cipherparams: unknown;
    ciphertext: string;
    kdf: string;
    kdfparams: unknown;
    mac: string;
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
  name: string;
  source: KeyStoreSource;
  pairs: unknown[];
  createdAt: Date;
}

export type ImportKeyStoreParams = ImportKeyStoreParams.Type;

export namespace ImportKeyStoreParams {
  export type Type = HDKeyStore | JSONKeyStore | PrivateKey;

  interface Generanl {
    name: string;
    overwrite: boolean;
    password: string;
    passwordHint?: string;
  }

  export interface HDKeyStore extends Generanl {
    type: KeyStoreSource.Mnemonic;
    mnemonic: string;
  }

  export interface JSONKeyStore extends Generanl {
    type: KeyStoreSource.EncryptedJSON;
    payload: KeyStore.EncryptedJSON;
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
    network: NetworkType;
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
