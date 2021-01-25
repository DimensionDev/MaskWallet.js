import { assertPlainObject } from 'asserts';
import { HDKeyStoreManager, HDWallet } from 'keystore';
import { KeyStoreAgent, KeyStoreRegistry } from 'types';

export { getCoinRegistry } from 'coin-registry';

let wallet: HDWallet | undefined;
let keyStore: HDKeyStoreManager | undefined;

export function setKeyStoreRegistry(registry: KeyStoreRegistry): void {
  assertPlainObject(registry);
  if (wallet !== undefined || keyStore !== undefined) {
    throw new TypeError('Not allowed');
  }
  const agent = new KeyStoreAgent(registry);
  wallet = new HDWallet(agent);
  keyStore = new HDKeyStoreManager(agent);
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
