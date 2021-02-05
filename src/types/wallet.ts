import { KeyStore } from '../crypto-suite';
import { KeyPair, KeyStoreSnapshot, KeyStoreSource, KeyStoreType } from './keystore';

export enum UnlockKeyType {
  Password = 'Password',
}

export enum ChainType {
  Ethereum = 'Ethereum',
  BitcoinCash = 'BitcoinCash',
  Substrate = 'Substrate',
}

//#region create key store params

export type CreateKeyStoreParams = CreateKeyStoreParams.Type;

namespace CreateKeyStoreParams {
  export type Type = HDKeyStore;

  interface HDKeyStore {
    type: KeyStoreType.HDKeyStore;
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

namespace ImportKeyStoreParams {
  export type Type = Mnemonic | KeyStoreJSON | PrivateKey;

  interface General {
    type: KeyStoreType.HDKeyStore;
    name: string;
    password: string;
    passwordHint?: string;
    overwrite?: boolean;
  }

  interface Mnemonic extends General {
    source: KeyStoreSource.Mnemonic;
    mnemonic: string;
  }

  interface KeyStoreJSON extends General {
    source: KeyStoreSource.KeyStore;
    store: KeyStore;
  }

  interface PrivateKey extends General {
    source: KeyStoreSource.PrivateKey;
    key: Uint8Array;
  }
}

//#endregion

//#region export key store params

export type ExportKeyStoreParams = ExportKeyStoreParams.Type;

namespace ExportKeyStoreParams {
  export type Type = Mnemonic | PrivateKey;

  interface General {
    type: KeyStoreType.HDKeyStore;
    hash: KeyStoreSnapshot['hash'];
    password: string;
  }

  interface Mnemonic extends General {
    source: KeyStoreSource.Mnemonic;
    mnemonic: string;
  }

  interface PrivateKey extends General {
    source: KeyStoreSource.PrivateKey;
    chainType: ChainType;
    network: string;
  }
}

//#endregion

//#region sign params

export type SignParams = SignParams.Type;

namespace SignParams {
  export interface Type {
    hash: KeyStoreSnapshot['hash'];
    chainType: ChainType;
    address: string;
    unlockKeyType: UnlockKeyType;
    input: unknown;
  }
}

//#endregion
