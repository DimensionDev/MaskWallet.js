import { KeyStore } from 'crypto-suite/types';
import { KeyPair, KeyStoreSnapshot, KeyStoreSource } from './keystore';

export enum UnlockKeyType {
  Password = 'Password',
  DeriverdKey = 'DeriverdKey',
}

export enum ChainType {
  Ethereum = 'Ethereum',
  BitcoinCash = 'BitcoinCash',
  Substrate = 'Substrate',
}

//#region create key store params

export type CreateKeyStoreParams = CreateKeyStoreParams.Type;

export namespace CreateKeyStoreParams {
  export type Type = HDKeyStore;

  interface HDKeyStore {
    type: 'hd';
    source: KeyStoreSource.Mnemonic;
    name?: string;
    password: string;
    passwordHint?: string;
  }
}

export interface CreateKeyStoreResult {
  keyHash: string;
  name: string;
  source: KeyStoreSource;
  pairs: KeyPair[];
  createdAt: Date;
}

//#endregion

//#region import key store params

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

  interface Mnemonic extends Generanl {
    source: KeyStoreSource.Mnemonic;
    mnemonic: string;
  }

  interface JSON extends Generanl {
    source: KeyStoreSource.EncryptedJSON;
    payload: KeyStore;
  }

  interface PrivateKey extends Generanl {
    source: KeyStoreSource.PrivateKey;
    privateKey: string;
  }
}

//#endregion

//#region export key store params

export type ExportKeyStoreParams = ExportKeyStoreParams.Type;

export namespace ExportKeyStoreParams {
  export type Type = Mnemonic | PrivateKey;

  interface Generanl {
    type: 'hd';
    hash: KeyStoreSnapshot['hash'];
    password: string;
  }

  interface Mnemonic extends Generanl {
    source: KeyStoreSource.Mnemonic;
    mnemonic: string;
  }

  interface PrivateKey extends Generanl {
    source: KeyStoreSource.PrivateKey;
    chainType: ChainType;
    network: string;
  }
}

//#endregion

//#region sign params

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

//#endregion
