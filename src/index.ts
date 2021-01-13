import { StorageRegistry } from './types';
import { Wallet } from './wallet';

let wallet: Wallet | undefined;

export function setStorageRegistry(registry: StorageRegistry): void {
  if (wallet !== undefined) {
    throw new TypeError('Not allowed');
  }
  wallet = new Wallet(registry);
}

export function getWalletInstance() {
  if (wallet === undefined) {
    throw new TypeError('Please provide `StorageRegistry`.');
  }
  return wallet;
}
