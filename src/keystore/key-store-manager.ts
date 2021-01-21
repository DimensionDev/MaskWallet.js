import { assertPlainObject, assertStorageRegistry } from 'asserts';
import { WalletError } from 'errors';
import { HDKeyStore } from 'keystore';
import {
  CreateKeyStoreParams,
  CreateKeyStoreResult,
  ExportKeyStoreParams,
  ImportKeyStoreParams,
  KeyStoreSnapshot,
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
    const snapshot = await HDKeyStore.import(params);
    if (!params.overwrite) {
      await this.assertHasKeyStore(snapshot.keyHash);
    }
    await this.#registry.setKeyStore(snapshot.keyHash, snapshot.toJSON());
  }

  async export(params: ExportKeyStoreParams) {
    assertPlainObject(params, '`params` parameter');
    await this.assertHasKeyStore(params.hash);
    const snapshot = await this.#registry.getKeyStore(params.hash);
    const store = new HDKeyStore(snapshot!);
    if (params.source === KeyStoreSource.Mnemonic) {
      await store.unlock(UnlockKeyType.DeriverdKey, params.mnemonic);
      return store.exportMnemonic();
    } else if (params.source === KeyStoreSource.PrivateKey) {
      await store.unlock(UnlockKeyType.Password, params.password);
      return store.exportPrivateKey(params.chainType, params.hash);
    }
  }

  async delete(hash: KeyStoreSnapshot['hash']) {
    await this.assertHasKeyStore(hash);
    return this.#registry.deleteKeyStore(hash);
  }

  getAllKeyStories() {
    return this[Symbol.asyncIterator]();
  }

  async *[Symbol.asyncIterator]() {
    for await (const hash of this.#registry.hashes()) {
      const store = await this.#registry.getKeyStore(hash);
      if (store === undefined || store.type !== 'hd') {
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

  async destroy() {
    for await (const hash of this.#registry.hashes()) {
      const store = await this.#registry.getKeyStore(hash);
      if (store === undefined || store.type !== 'hd') {
        continue;
      }
      await this.#registry.deleteKeyStore(hash);
    }
  }

  private async assertHasKeyStore(hash: KeyStoreSnapshot['hash']) {
    if (!(await this.#registry.hasKeyStore(hash))) {
      throw new WalletError(`The ${hash} key store not found.`);
    }
  }

  get [Symbol.toStringTag]() {
    return 'HDKeyStoreManager';
  }
}
