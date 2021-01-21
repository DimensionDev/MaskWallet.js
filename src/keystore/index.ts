import { assertPlainObject, assertSnapshot } from 'asserts';
import { WalletError } from 'errors';
import { CoinInfo, ImportKeyStoreParams, KeyPair, KeyStore, KeyType, TypedKeyStore, UnlockKeyType } from 'keystore/types';

export class HDKeyStore implements TypedKeyStore {
  #snapshot: Readonly<KeyStore.Snapshot>;
  #store: UnlockedStore | null = null;

  static create(params: ImportKeyStoreParams): Promise<HDKeyStore> {
    assertPlainObject(params, '`params` parameter');
    throw new WalletError('not implemented');
  }

  constructor(snapshot: Readonly<KeyStore.Snapshot>) {
    assertSnapshot(snapshot);
    this.#snapshot = Object.freeze<KeyStore.Snapshot>({
      version: snapshot.version,
      hash: snapshot.hash,

      format: snapshot.format,
      payload: Object.freeze({ ...snapshot.payload }),

      metadata: snapshot.metadata,
    });
  }

  // #region locker
  isLocked() {
    return this.#store === null;
  }

  lock() {
    this.#store = null;
  }

  async unlock(type: UnlockKeyType, value: string) {
    // TODO: verify unlock data correctness
    this.#store = Object.freeze({ type, value });
    return true;
  }

  assertUnlocked() {
    if (this.isLocked()) {
      throw new WalletError('This key store need unlock.');
    }
  }
  // #endregion

  async find(type: KeyType, symbol: string, address: string, path?: string): Promise<unknown> {
    throw new WalletError('not implemented');
  }

  async exportMnemonic(): Promise<string> {
    this.assertUnlocked();
    throw new WalletError('not implemented');
  }

  async exportPrivateKey(coin: string, mainAddress: string, path?: string): Promise<string> {
    this.assertUnlocked();
    throw new WalletError('not implemented');
  }

  async deriveKey(info: CoinInfo): Promise<KeyPair> {
    this.assertUnlocked();
    throw new WalletError('not implemented');
  }

  sign(source: BufferSource, symbol: string, address: string, path?: string): Promise<string> {
    this.assertUnlocked();
    throw new WalletError('not implemented');
  }

  signRecoverableHash(source: BufferSource, symbol: string, address: string, path?: string): Promise<string> {
    this.assertUnlocked();
    throw new WalletError('not implemented');
  }

  get keyHash() {
    return this.#snapshot.hash;
  }

  toJSON(): Readonly<KeyStore.Snapshot> {
    return this.#snapshot;
  }
}

interface UnlockedStore {
  type: UnlockKeyType;
  value: string;
}
