import { KeyStore } from 'crypto-suite/types';
import { KeyStoreSnapshot, KeyStoreSource } from './keystore';

export enum UnlockKeyType {
  Password = 'Password',
  DeriverdKey = 'DeriverdKey',
}

export enum ChainType {
  Ethereum = 'Ethereum',
  BitcoinCash = 'BitcoinCash',
  Substrate = 'Substrate',
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
