import { assertFrozen, assertPlainObject, assertSnapshot, assertStorageRegistry } from 'asserts';
import { WalletError } from 'errors';
import { CoinInfo, KeyStoreSnapshot, KeyType, SignParams, StorageRegistry } from 'keystore/types';

export class HDWallet {
  #storage: Readonly<StorageRegistry>;

  constructor(storage: StorageRegistry) {
    assertStorageRegistry(storage, '`storage` parameter');
    this.#storage = storage;
    Object.freeze(this);
  }

  // #region cryptographic operations
  async deriveKey(hash: KeyStoreSnapshot['hash'], info: Readonly<CoinInfo>): Promise<boolean> {
    assertFrozen(info, '`info` parameter');
    assertPlainObject(info, '`info` parameter');
    const snapshot = await this.#storage.getHDKeyStore(hash);
    assertSnapshot(snapshot, '`snapshot`');
    throw new WalletError('not implemented');
  }

  async verify(hash: KeyStoreSnapshot['hash'], password: string): Promise<boolean> {
    const snapshot = await this.#storage.getHDKeyStore(hash);
    assertSnapshot(snapshot, 'snapshot');
    throw new WalletError('not implemented');
  }

  async exists(type: KeyType.Mnemonic, mnemonic: string): Promise<boolean>;
  async exists(type: KeyType.PrivateKey, key: string): Promise<boolean>;
  async exists(type: KeyType, value: string): Promise<boolean> {
    throw new WalletError('not implemented');
  }

  async signTransaction(params: SignParams) {
    assertPlainObject(params, '`params` parameter');
    throw new WalletError('not implemented');
  }
  // #endregion

  get [Symbol.toStringTag]() {
    return 'Wallet';
  }
}
