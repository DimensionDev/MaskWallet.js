import { assertFrozen, assertPlainObject, assertSnapshot, assertStorageRegistry } from 'asserts';
import { CoinInfo } from 'coin-registry';
import { WalletError } from 'errors';
import { KeyStoreSnapshot, KeyType, SignParams, StorageRegistry } from 'types';

export class HDWallet {
  #registry: Readonly<StorageRegistry>;

  constructor(registry: StorageRegistry) {
    assertStorageRegistry(registry, '`registry` parameter');
    this.#registry = registry;
    Object.freeze(this);
  }

  // #region cryptographic operations
  async deriveKey(hash: KeyStoreSnapshot['hash'], info: Readonly<CoinInfo>): Promise<boolean> {
    assertFrozen(info, '`info` parameter');
    assertPlainObject(info, '`info` parameter');
    const snapshot = await this.#registry.getHDKeyStore(hash);
    assertSnapshot(snapshot, '`snapshot`');
    throw new WalletError('not implemented');
  }

  async verify(hash: KeyStoreSnapshot['hash'], password: string): Promise<boolean> {
    const snapshot = await this.#registry.getHDKeyStore(hash);
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
