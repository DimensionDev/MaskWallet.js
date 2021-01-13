import { TypedKeyStore } from './key-store';
import {
  CoinInfo,
  CreateKeyStoreParams,
  ExportKeyStoreParams,
  ImportKeyStoreParams,
  KeyStore,
  KeyStoreSource,
  KeyType,
  SignParams,
  StorageRegistry,
} from './types';

export class Wallet {
  #storage: StorageRegistry;

  public constructor(storage: StorageRegistry) {
    this.#storage = storage;
  }

  // #region key store
  public async createKeyStore(params: CreateKeyStoreParams) {
    throw new Error('not implemented');
  }

  public async importKeyStore(params: ImportKeyStoreParams) {
    const snapshot = await TypedKeyStore.create(params);
    const exists = await this.#storage.hasKeyStore(snapshot.keyHash);
    if (exists && !params.overwrite) {
      throw new Error('This key hash already exists.');
    }
    await this.#storage.setKeyStore(snapshot.toJSON());
  }

  public async exportKeyStore(params: ExportKeyStoreParams) {
    const snapshot = await this.#storage.getKeyStore(params.hash);
    if (snapshot === undefined) {
      throw new Error('This key hash not found.');
    }
    const store = new TypedKeyStore(snapshot);
    if (params.type === KeyStoreSource.Mnemonic) {
      return store.exportMnemonic(params.mnemonic);
    }
    throw new TypeError(`${params.type} not supported`);
  }

  public async getKeyStoreType(hash: KeyStore.Snapshot['hash']): Promise<KeyStoreSource[]> {
    throw new Error('not implemented');
  }

  public async getAllKeyStoreMetadata(): Promise<Record<KeyStore.Snapshot['hash'], KeyStore.Metadata>> {
    const hashes = await this.#storage.hashes();
    const stores = await Promise.all(hashes.map(this.#storage.getKeyStore));
    const records: Record<KeyStore.Snapshot['hash'], KeyStore.Metadata> = {};
    for (const store of stores) {
      if (store) {
        records[store.hash] = store.metadata;
      }
    }
    return records;
  }
  // #endregion

  // #region cryptographic operations
  public async deriveKey(hash: KeyStore.Snapshot['hash'], info: Readonly<CoinInfo>): Promise<boolean> {
    throw new Error('not implemented');
  }

  public async verify(hash: KeyStore.Snapshot['hash'], password: string): Promise<boolean> {
    throw new Error('not implemented');
  }

  public async exists(type: KeyType.Mnemonic, mnemonic: string): Promise<boolean>;
  public async exists(type: KeyType.PrivateKey, key: string): Promise<boolean>;
  public async exists(type: KeyType, value: string): Promise<boolean> {
    throw new Error('not implemented');
  }

  public async delete(hash: KeyStore.Snapshot['hash'], password: string): Promise<void> {
    throw new Error('not implemented');
  }

  public async signTransaction(params: SignParams) {
    throw new Error('not implemented');
  }
  // #endregion

  public [Symbol.toStringTag]() {
    return 'Wallet';
  }
}
