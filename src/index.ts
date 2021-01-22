import { assertPlainObject } from 'asserts';
import { HDKeyStoreManager } from 'keystore/hd-key-store';
import { HDWallet } from 'keystore/hd-wallet';
import { KeyStoreRegistry } from 'types';

export { getCoinRegistry } from 'coin-registry';

let wallet: HDWallet | undefined;
let keyStore: HDKeyStoreManager | undefined;

export function setKeyStoreRegistry(registry: KeyStoreRegistry): void {
  assertPlainObject(registry);
  if (wallet !== undefined || keyStore !== undefined) {
    throw new TypeError('Not allowed');
  }
  wallet = new HDWallet(registry);
  keyStore = new HDKeyStoreManager(registry);
}

export function getHDWalletInstance() {
  if (wallet === undefined) {
    throw new TypeError('Please provide an `KeyStoreRegistry`.');
  }
  return wallet;
}

export async function getKeyStoreManager() {
  if (keyStore === undefined) {
    throw new TypeError('Please provide an `KeyStoreRegistry`.');
  }
  return keyStore;
}
