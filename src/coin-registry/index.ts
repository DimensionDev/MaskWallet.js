import { CurveType } from 'keystore/types';
import registry from './registry.json';

registry.forEach(Object.freeze);
Object.freeze(registry);

export function getCoinRegistry() {
  return registry as ReadonlyArray<CoinInfo>;
}

export type CoinInfo = Readonly<CoinInfo.Type>;

export namespace CoinInfo {
  export type Type = CurveCoin | RSACoin;

  export interface CurveCoin {
    type: 'curve';
    coin: string;
    derivationPath: string;
    curve: CurveType;
    network: string;
    segWit?: string;
  }

  export type KeyType = 'RSA-4096';
  export type EncryptionAlgorithm = 'AES-256-CBC';
  export type HashAlgorithm = 'SHA-256' | 'SHA-384';

  export interface RSACoin {
    type: 'rsa';
    coin: string;
    suite: [KeyType, EncryptionAlgorithm, HashAlgorithm];
    network: string;
  }
}
