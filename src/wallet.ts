import { WalletError } from './errors';
import { CoinInfo, KeyStore, KeyType, SignParams, StorageRegistry } from './types';

export class Wallet {
  #storage: StorageRegistry;

  public constructor(storage: StorageRegistry) {
    this.#storage = storage;
    Object.freeze(this);
  }

  // #region cryptographic operations
  public async deriveKey(hash: KeyStore.Snapshot['hash'], info: Readonly<CoinInfo>): Promise<boolean> {
    throw new WalletError('not implemented');
  }

  public async verify(hash: KeyStore.Snapshot['hash'], password: string): Promise<boolean> {
    throw new WalletError('not implemented');
  }

  public async exists(type: KeyType.Mnemonic, mnemonic: string): Promise<boolean>;
  public async exists(type: KeyType.PrivateKey, key: string): Promise<boolean>;
  public async exists(type: KeyType, value: string): Promise<boolean> {
    throw new WalletError('not implemented');
  }

  public async signTransaction(params: SignParams) {
    throw new WalletError('not implemented');
  }
  // #endregion

  public [Symbol.toStringTag]() {
    return 'Wallet';
  }
}
