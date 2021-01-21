import { KeyStoreSnapshot } from './keystore';

export interface StorageRegistry {
  hashes(): AsyncGenerator<KeyStoreSnapshot['hash']>;
  hasHDKeyStore(hash: KeyStoreSnapshot['hash']): Promise<boolean>;
  getHDKeyStore(hash: KeyStoreSnapshot['hash']): Promise<Readonly<KeyStoreSnapshot> | undefined>;
  setHDKeyStore(hash: KeyStoreSnapshot['hash'], snapshot: Readonly<KeyStoreSnapshot>): Promise<void>;
  deleteHDKeyStore(hash: KeyStoreSnapshot['hash']): Promise<void>;
}
