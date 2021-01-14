import { WalletError } from './errors';
import { CoinInfo, ImportKeyStoreParams, KeyStore, UnlockKeyType } from './types';

export class TypedKeyStore {
  #snapshot: KeyStore.Snapshot;
  #store: UnlockedStore | null = null;

  public static create(params: ImportKeyStoreParams): Promise<TypedKeyStore> {
    throw new WalletError('not implemented');
  }

  public constructor(snapshot: Readonly<KeyStore.Snapshot>) {
    this.#snapshot = { ...snapshot };
  }

  // #region locker
  public isLocked() {
    return this.#store === null;
  }

  public lock() {
    this.#store = null;
  }

  public unlock(type: UnlockKeyType.Password, password: string): Promise<boolean>;
  public unlock(type: UnlockKeyType.DeriverdKey, key: string): Promise<boolean>;
  public async unlock(type: UnlockKeyType, value: string): Promise<boolean> {
    // TODO: verify unlock data correctness
    this.#store = Object.freeze({ type, value });
    return true;
  }
  // #endregion

  public exportMnemonic(): Promise<string> {
    throw new WalletError('not implemented');
  }

  public exportPrivateKey(coin: string, mainAddress: string, path?: string): Promise<string> {
    throw new WalletError('not implemented');
  }

  public derive(info: CoinInfo) {
    throw new WalletError('not implemented');
  }

  public findPrivateKey(symbol: string, address: string, path?: string): Promise<unknown> {
    throw new WalletError('not implemented');
  }

  public findDeterminisitcPublicKey(symbol: string, address: string): Promise<unknown> {
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
    return this.#snapshot; // copy the object and freeze it
  }
}

interface UnlockedStore {
  type: UnlockKeyType;
  value: string;
}
