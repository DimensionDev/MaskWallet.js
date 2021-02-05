import { assertPlainObject } from '../asserts';
import { WalletError } from '../errors';
import { HDKeyStore } from '../keystore/hd-key-store';
import {
  CreateKeyStoreParams,
  CreateKeyStoreResult,
  ExportKeyStoreParams,
  ImportKeyStoreParams,
  KeyStoreAgent,
  KeyStoreSnapshot,
  KeyStoreSnapshotMarked,
  KeyStoreSource,
  KeyStoreType,
  UnlockKeyType,
} from '../types';

export class HDKeyStoreManager {
  #registry: KeyStoreAgent;

  constructor(registry: KeyStoreAgent) {
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
    if (!params.overwrite) {
      await this.#registry.assertKeyStoreAvailable(snapshot.keyHash);
    }
    await this.#registry.setKeyStore(snapshot.keyHash, snapshot.toJSON());
  }

  async export(params: ExportKeyStoreParams) {
    assertPlainObject(params, '`params` parameter');
    await this.#registry.assertKeyStoreAvailable(params.hash);
    const snapshot = await this.#registry.getKeyStore(params.hash);
    const store = new HDKeyStore(snapshot!);
    if (params.source === KeyStoreSource.PrivateKey) {
      await store.unlock(UnlockKeyType.Password, params.password);
      return store.exportPrivateKey(params.chainType, params.hash);
    }
  }

  async delete(hash: KeyStoreSnapshot['hash']) {
    await this.#registry.assertKeyStoreAvailable(hash);
    return this.#registry.setKeyStore(hash, undefined);
  }

  async *getAllKeyStories(): AsyncGenerator<Readonly<KeyStoreSnapshotMarked>, void, unknown> {
    for await (const hash of this.#registry.hashes()) {
      const store = await this.#registry.getKeyStore(hash);
      if (store === undefined || store.type !== KeyStoreType.HD) {
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
    return this.#registry.clear();
  }

  get [Symbol.toStringTag]() {
    return 'HDKeyStoreManager';
  }
}
