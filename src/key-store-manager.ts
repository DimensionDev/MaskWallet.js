import { WalletError } from './errors';
import { TypedKeyStore } from './key-store';
import {
  CreateKeyStoreParams,
  CreateKeyStoreResult,
  ExportKeyStoreParams,
  ImportKeyStoreParams,
  KeyStoreSource,
  StorageRegistry,
  UnlockKeyType
} from './types';

export class KeyStoreManager {
  #storage: StorageRegistry;

  public constructor(storage: StorageRegistry) {
    this.#storage = storage;
    Object.freeze(this);
  }

  public async create(params: CreateKeyStoreParams): Promise<CreateKeyStoreResult> {
    throw new WalletError('not implemented');
  }

  public async import(params: ImportKeyStoreParams) {
    const snapshot = await TypedKeyStore.create(params);
    const exists = await this.#storage.hasKeyStore(snapshot.keyHash);
    if (exists && !params.overwrite) {
      throw new WalletError('This key hash already exists.');
    }
    await this.#storage.setKeyStore(snapshot.toJSON());
  }

  public async export(params: ExportKeyStoreParams) {
    const snapshot = await this.#storage.getKeyStore(params.hash);
    if (snapshot === undefined) {
      throw new WalletError('This key hash not found.');
    }
    const store = new TypedKeyStore(snapshot);
    if (params.type === KeyStoreSource.Mnemonic) {
      await store.unlock(UnlockKeyType.DeriverdKey, params.mnemonic);
      return store.exportMnemonic();
    } else if (params.type === KeyStoreSource.PrivateKey) {
      await store.unlock(UnlockKeyType.Password, params.password);
      return store.exportPrivateKey(params.chainType, params.hash);
    }
  }
