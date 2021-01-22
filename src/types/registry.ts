import { KeyStoreSnapshot } from './keystore';

export interface KeyStoreRegistry {
  hashes(): AsyncGenerator<KeyStoreSnapshot['hash']>;
  hasKeyStore(hash: KeyStoreSnapshot['hash']): Promise<boolean>;
  getKeyStore(hash: KeyStoreSnapshot['hash']): Promise<Readonly<KeyStoreSnapshot> | undefined>;
  setKeyStore(hash: KeyStoreSnapshot['hash'], snapshot: Readonly<KeyStoreSnapshot>): Promise<void>;
  deleteKeyStore(hash: KeyStoreSnapshot['hash']): Promise<void>;
}
