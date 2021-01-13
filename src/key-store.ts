import { CoinInfo, ImportKeyStoreParams, KeyStore, UnlockedKeyType } from './types';

export class TypedKeyStore {
  #input: KeyStore.Snapshot;
  #store: UnlockedStore | null = null;

  static create(params: ImportKeyStoreParams): Promise<TypedKeyStore> {
    throw new Error('not implemented');
  }

  constructor(input: Readonly<KeyStore.Snapshot>) {
    this.#input = input;
  }

  // #region locker
  isLocked(): boolean {
    return this.#store === null;
  }

  lock(): void {
    this.#store = null;
  }

  unlock(type: UnlockedKeyType.Password, password: string): Promise<boolean>;
  unlock(type: UnlockedKeyType.DeriverdKey, key: string): Promise<boolean>;
  async unlock(type: UnlockedKeyType, value: string): Promise<boolean> {
    // TODO: verify unlock data correntness
    this.#store = Object.freeze({ type, value });
    return true;
  }
  // #endregion

  exportMnemonic(mnemonic: string): Promise<string> {
    throw new Error('not implemented');
  }

  exportPrivateKey(coin: string, mainAddress: string, path?: string): Promise<string> {
    throw new Error('not implemented');
  }

  derive(info: CoinInfo) {
    throw new Error('not implemented');
  }

  findPrivateKey(symbol: string, address: string, path?: string): Promise<unknown> {
    throw new Error('not implemented');
  }

  findDeterminisitcPublicKey(symbol: string, address: string): Promise<unknown> {
    throw new Error('not implemented');
  }

  sign(source: BufferSource, symbol: string, address: string, path?: string): Promise<string> {
    throw new Error('not implemented');
  }

  signRecoverableHash(source: BufferSource, symbol: string, address: string, path?: string): Promise<string> {
    throw new Error('not implemented');
  }

  get keyHash() {
    return this.#input.hash;
  }

  toJSON(): Readonly<KeyStore.Snapshot> {
    return this.#input; // copy the object and freeze it
  }
}

interface UnlockedStore {
  type: UnlockedKeyType;
  value: string;
}
