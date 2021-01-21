import { StorageRegistry } from './types';
import { HDWallet } from './keystore/wallet';
import { HDKeyStoreManager } from './key-store-manager';

export { getCoinRegistry } from './coin-registry';

let wallet: HDWallet | undefined;
let keyStore: HDKeyStoreManager | undefined;

export function setStorageRegistry(registry: StorageRegistry): void {
  if (wallet !== undefined || keyStore !== undefined) {
    throw new TypeError('Not allowed');
  }
  wallet = new HDWallet(registry);
  keyStore = new HDKeyStoreManager(registry);
}

export function getHDWalletInstance() {
  if (wallet === undefined) {
    throw new TypeError('Please provide an `StorageRegistry`.');
  }
  return wallet;
}

export function getHDKeyStoreManager() {
  if (keyStore === undefined) {
    throw new TypeError('Please provide an `StorageRegistry`.');
  }
  return keyStore;
}
