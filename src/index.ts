import { StorageRegistry } from './types';
import { Wallet } from './wallet';
import { KeyStoreManager } from './key-store-manager';

export { getCoinRegistry } from './coin-registry';

let wallet: Wallet | undefined;
let keyStore: KeyStoreManager | undefined;

export function setStorageRegistry(registry: StorageRegistry): void {
  if (wallet !== undefined || keyStore !== undefined) {
    throw new TypeError('Not allowed');
  }
  wallet = new Wallet(registry);
  keyStore = new KeyStoreManager(registry);
}

export function getWalletInstance() {
  if (wallet === undefined) {
    throw new TypeError('Please provide an `StorageRegistry`.');
  }
  return wallet;
}

export function getKeyStoreManager() {
  if (keyStore === undefined) {
    throw new TypeError('Please provide an `StorageRegistry`.');
  }
  return keyStore;
}
