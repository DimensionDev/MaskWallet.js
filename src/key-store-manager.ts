import { assertPlainObject, assertStorageRegistry } from 'asserts';
import { WalletError } from 'errors';
import { HDKeyStore } from 'keystore';
import {
  CreateKeyStoreParams,
  CreateKeyStoreResult,
  ExportKeyStoreParams,
  ImportKeyStoreParams,
  KeyStoreSource,
  StorageRegistry,
  SystemKind,
  UnlockKeyType,
} from 'types';

export class HDKeyStoreManager {
  #storage: Readonly<StorageRegistry>;

  constructor(storage: StorageRegistry) {
    assertStorageRegistry(storage);
    this.#storage = storage;
    Object.freeze(this);
  }

  async create(params: CreateKeyStoreParams): Promise<CreateKeyStoreResult> {
    assertPlainObject(params, '`params` parameter');
    throw new WalletError('not implemented');
  }

  async import(params: ImportKeyStoreParams) {
    assertPlainObject(params, '`params` parameter');
    if (params.kind !== SystemKind.HDKeyStore) {
      throw new TypeError('This kind not supported');
    }
    const snapshot = await HDKeyStore.create(params);
    const exists = await this.#storage.hasHDKeyStore(snapshot.keyHash);
    if (exists && !params.overwrite) {
      throw new WalletError('This key hash already exists.');
    }
    await this.#storage.setHDKeyStore(snapshot.keyHash, snapshot.toJSON());
  }

  async export(params: ExportKeyStoreParams) {
    assertPlainObject(params, '`params` parameter');
    if (params.kind !== SystemKind.HDKeyStore) {
      throw new TypeError('This kind not supported');
    }
    const snapshot = await this.#storage.getHDKeyStore(params.hash);
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

  get [Symbol.toStringTag]() {
    return 'KeyStoreManager';
  }
}
