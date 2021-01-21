import { assertPlainObject, assertStorageRegistry } from 'asserts';
import { WalletError } from 'errors';
import { HDKeyStore } from 'keystore';
import {
  CreateKeyStoreParams,
  CreateKeyStoreResult,
  ExportKeyStoreParams,
  ImportKeyStoreParams,
  KeyStoreSnapshotMarked,
  KeyStoreSource,
  StorageRegistry,
  UnlockKeyType,
} from 'types';

export class HDKeyStoreManager {
  #registry: Readonly<StorageRegistry>;

  constructor(registry: StorageRegistry) {
    assertStorageRegistry(registry);
    this.#registry = registry;
    Object.freeze(this);
  }

  async create(params: CreateKeyStoreParams): Promise<CreateKeyStoreResult> {
    assertPlainObject(params, '`params` parameter');
    throw new WalletError('not implemented');
  }

  async import(params: ImportKeyStoreParams) {
    assertPlainObject(params, '`params` parameter');
    const snapshot = await HDKeyStore.create(params);
    const exists = await this.#registry.hasHDKeyStore(snapshot.keyHash);
    if (exists && !params.overwrite) {
      throw new WalletError('This key hash already exists.');
    }
    await this.#registry.setHDKeyStore(snapshot.keyHash, snapshot.toJSON());
  }

  async export(params: ExportKeyStoreParams) {
    assertPlainObject(params, '`params` parameter');
    const snapshot = await this.#registry.getHDKeyStore(params.hash);
    if (snapshot === undefined) {
      throw new WalletError('This key hash not found.');
    }
    const store = new HDKeyStore(snapshot);
    if (params.source === KeyStoreSource.Mnemonic) {
      await store.unlock(UnlockKeyType.DeriverdKey, params.mnemonic);
      return store.exportMnemonic();
    } else if (params.source === KeyStoreSource.PrivateKey) {
      await store.unlock(UnlockKeyType.Password, params.password);
      return store.exportPrivateKey(params.chainType, params.hash);
    }
  }

  async *getAllKeyStories() {
    for await (const hash of this.#registry.hashes()) {
      const store = await this.#registry.getHDKeyStore(hash);
      if (store === undefined) {
        continue;
      }
      yield Object.freeze<KeyStoreSnapshotMarked>({
        version: store.version,
        type: store.type,
        hash: store.hash,
        name: store.meta.name,
        source: store.meta.source,
        timestamp: store.meta.timestamp,
        remark: store.meta.remark,
        passwordHint: store.meta.passwordHint,
      });
    }
  }

  get [Symbol.toStringTag]() {
    return 'HDKeyStoreManager';
  }
}
