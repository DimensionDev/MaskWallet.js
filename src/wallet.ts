import { ChainType, CoinInfo, KeyStore, KeyStoreSource, KeyType, NetworkType, StorageRegistry, UnlockedKeyType } from './types';

export class Wallet {
  public constructor(storage: StorageRegistry) {
    throw new Error('not implemented');
  }

  // #region key store
  public createKeyStore(params: CreateKeyStoreParams) {
    throw new Error('not implemented');
  }

  public importKeyStore(params: ImportKeyStoreParams.Type) {
    throw new Error('not implemented');
  }

  public exportKeyStore(params: ExportKeyStoreParams.Type) {
    throw new Error('not implemented');
  }

  public getKeyStoreType(hash: KeyStore.Snapshot['hash']): Promise<KeyStoreSource[]> {
    throw new Error('not implemented');
  }

  public getAllKeyStoreMetadata(): Promise<Record<KeyStore.Snapshot['hash'], KeyStore.Metadata>> {
    throw new Error('not implemented');
  }
  // #endregion

  // #region cryptographic operations
  public deriveKey(hash: KeyStore.Snapshot['hash'], info: CoinInfo): Promise<boolean> {
    throw new Error('not implemented');
  }

  public verify(hash: KeyStore.Snapshot['hash'], password: string): Promise<boolean> {
    throw new Error('not implemented');
  }

  public exists(type: KeyType.Mnemonic, mnemonic: string): Promise<boolean>;
  public exists(type: KeyType.PrivateKey, key: string): Promise<boolean>;
  public exists(type: KeyType, value: string): Promise<boolean> {
    throw new Error('not implemented');
  }

  public delete(hash: KeyStore.Snapshot['hash'], password: string): Promise<void> {
    throw new Error('not implemented');
  }

  public signTransaction(params: SignParams.SignParams) {
    throw new Error('not implemented');
  }
  // #endregion

  public [Symbol.toStringTag]() {
    return 'Wallet';
  }
}

export interface CreateKeyStoreParams {
  name?: string;
  password: string;
  passwordHint?: string;
}

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
    type: KeyStoreSource.ExcryptedJSON;
    payload: unknown;
  }

  export interface PrivateKey extends Generanl {
    type: KeyStoreSource.PrivateKey;
    privateKey: string;
  }
}

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

export namespace SignParams {
  export interface SignParams {
    hash: KeyStore.Snapshot['hash'];
    chainType: ChainType;
    address: string;
    unlockKeyType: UnlockedKeyType;
    input: unknown;
  }
}
