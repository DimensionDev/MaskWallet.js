import { assertPlainObject, assertStorageRegistry } from './asserts';
import { WalletError } from './errors';
import { HDKeyStore } from './key-store';
import {
  CreateKeyStoreParams,
  CreateKeyStoreResult,
  ExportKeyStoreParams,
  ImportKeyStoreParams,
  KeyStoreSource,
  StorageRegistry,
  SystemKind,
  UnlockKeyType,
} from './types';

export class KeyStoreManager {
  #storage: Readonly<StorageRegistry>;

  public constructor(storage: StorageRegistry) {
    assertStorageRegistry(storage);
    this.#storage = storage;
    Object.freeze(this);
  }

  public async create(params: CreateKeyStoreParams): Promise<CreateKeyStoreResult> {
    assertPlainObject(params, '`params` parameter');
    throw new WalletError('not implemented');
  }

  public async import(params: ImportKeyStoreParams) {
    assertPlainObject(params, '`params` parameter');
    if (params.kind !== SystemKind.HDKeyStore) {
      throw new TypeError('This kind not supported');
    }
    const snapshot = await HDKeyStore.create(params);
    const exists = await this.#storage.hasKeyStore(snapshot.keyHash);
    if (exists && !params.overwrite) {
      throw new WalletError('This key hash already exists.');
    }
    await this.#storage.setKeyStore(snapshot.toJSON());
  }

  public async export(params: ExportKeyStoreParams) {
    assertPlainObject(params, '`params` parameter');
    if (params.kind !== SystemKind.HDKeyStore) {
      throw new TypeError('This kind not supported');
    }
    const snapshot = await this.#storage.getKeyStore(params.hash);
    if (snapshot === undefined) {
      throw new WalletError('This key hash not found.');
    }
    const store = new HDKeyStore(snapshot);
    if (params.type === KeyStoreSource.Mnemonic) {
      await store.unlock(UnlockKeyType.DeriverdKey, params.mnemonic);
      return store.exportMnemonic();
    } else if (params.type === KeyStoreSource.PrivateKey) {
      await store.unlock(UnlockKeyType.Password, params.password);
      return store.exportPrivateKey(params.chainType, params.hash);
    }
  }

  public [Symbol.toStringTag]() {
    return 'KeyStoreManager';
  }
}
