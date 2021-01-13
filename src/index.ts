import { CoinInfo, StorageRegistry } from './types';
import { Wallet } from './wallet';
import CoinRegistry from './coin-info.json';

let wallet: Wallet | undefined;

export function queryCoinInfo(predicate: (info: CoinInfo) => boolean) {
  return CoinRegistry.filter(predicate).map<Readonly<CoinInfo>>(Object.freeze);
}

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
