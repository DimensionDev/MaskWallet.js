import { assertPlainObject, assertSnapshot } from './asserts';
import { WalletError } from './errors';
import { CoinInfo, ImportKeyStoreParams, KeyPair, KeyStore, KeyType, TypedKeyStore, UnlockKeyType } from './types';

export class HDKeyStore implements TypedKeyStore {
  #snapshot: Readonly<KeyStore.Snapshot>;
  #store: UnlockedStore | null = null;

  public static create(params: ImportKeyStoreParams): Promise<HDKeyStore> {
    assertPlainObject(params, '`params` parameter');
    throw new WalletError('not implemented');
  }

  public constructor(snapshot: Readonly<KeyStore.Snapshot>) {
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
  public isLocked() {
    return this.#store === null;
  }

  public lock() {
    this.#store = null;
  }

  public async unlock(type: UnlockKeyType, value: string) {
    // TODO: verify unlock data correctness
    this.#store = Object.freeze({ type, value });
    return true;
  }
  // #endregion

  public async find(type: KeyType, symbol: string, address: string, path?: string): Promise<unknown> {
    throw new WalletError('not implemented');
  }

  public async exportMnemonic(): Promise<string> {
    throw new WalletError('not implemented');
  }

  public async exportPrivateKey(coin: string, mainAddress: string, path?: string): Promise<string> {
    throw new WalletError('not implemented');
  }

  public async deriveKey(info: CoinInfo): Promise<KeyPair> {
    throw new WalletError('not implemented');
  }

  public sign(source: BufferSource, symbol: string, address: string, path?: string): Promise<string> {
    throw new WalletError('not implemented');
  }

  public signRecoverableHash(source: BufferSource, symbol: string, address: string, path?: string): Promise<string> {
    throw new WalletError('not implemented');
  }

  public get keyHash() {
    return this.#snapshot.hash;
  }

  public toJSON(): Readonly<KeyStore.Snapshot> {
    return this.#snapshot;
  }
}

interface UnlockedStore {
  type: UnlockKeyType;
  value: string;
}
