import { CurveType } from '../types';
import registry from './registry.json';

registry.forEach(Object.freeze);
Object.freeze(registry);

export function getCoinRegistry(): ReadonlyArray<CoinInfo> {
  return registry as ReadonlyArray<CoinInfo>;
}

export type CoinInfo = Readonly<CoinInfo.Type>;

namespace CoinInfo {
  export type Type = CurveCoin | RSACoin;

  interface CurveCoin {
    type: 'curve';
    coin: string;
    derivationPath: string;
    curve: CurveType;
    network: string;
    segWit?: string;
  }

  type KeyType = 'RSA-4096';
  type EncryptionAlgorithm = 'AES-256-CBC';
  type HashAlgorithm = 'SHA-256' | 'SHA-384';

  interface RSACoin {
    type: 'rsa';
    coin: string;
    suite: [KeyType, EncryptionAlgorithm, HashAlgorithm];
    network: string;
  }
}
