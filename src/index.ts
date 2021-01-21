import { assertPlainObject } from 'asserts';
import { HDKeyStoreManager } from 'keystore/key-store-manager';
import { HDWallet } from 'keystore/wallet';
import { StorageRegistry } from 'types';

export { getCoinRegistry } from 'coin-registry';

let wallet: HDWallet | undefined;
let keyStore: HDKeyStoreManager | undefined;

export function setStorageRegistry(registry: StorageRegistry): void {
  assertPlainObject(registry);
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

export async function getKeyStoreManager() {
  if (keyStore === undefined) {
    throw new TypeError('Please provide an `StorageRegistry`.');
  }
  return keyStore;
}
