export interface CoinInfo {
  coin: string;
  derivationPath: string;
  curve: CurveType;
  network: NetworkType;
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
  SECP256k1 = 'SECP256k1',
  ED25519 = 'ED25519',
  Curve25519 = 'Curve25519',
  SubSr25519 = 'SubSr25519',
}

export enum KeyType {
  Mnemonic = 'Mnemonic',
  PrivateKey = 'PrivateKey',
}

export enum UnlockedKeyType {
  Password = 'Password',
  DeriverdKey = 'DeriverdKey',
}

export interface StorageRegistry {
  getKeyStore(hash: KeyStore.Snapshot['hash']): Promise<KeyStore.Snapshot | undefined>;
  setKeyStore(snapshot: Readonly<KeyStore.Snapshot>): Promise<void>;
  deleteKeyStore(hash: KeyStore.Snapshot['hash']): Promise<KeyStore.Snapshot>;
}

export enum KeyStoreSource {
  Mnemonic = 'Mnemonic',
  PrivateKey = 'PrivateKey',
  EcryptedJSON = 'EcryptedJSON',
}

export namespace KeyStore {
  interface PayloadMapping {
    keystore: EcryptedJSON;
  }

  export interface Snapshot<T extends keyof PayloadMapping = keyof PayloadMapping> {
    hash: string;

    format: T;
    version: number;
    payload: PayloadMapping[T];

    meta: Metadata;
  }

  export interface Metadata {
    name: string;
    source: KeyStoreSource;
    timestamp: Date;
    remark?: string;

    passwordHint: string;
  }

  export interface EcryptedJSON {
    cipher: string;
    cipherparams: unknown;
    ciphertext: string;
    kdf: string;
    kdfparams: unknown;
    mac: string;
  }
}
