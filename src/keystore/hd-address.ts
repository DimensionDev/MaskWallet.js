import { CoinInfo } from '../coin-registry';
import { PublicKey } from '../crypto-suite';

export abstract class HDAddress {
  public static isValid(address: string, info: CoinInfo) {
    throw new Error();
  }

  constructor(key: PublicKey, info: CoinInfo) {
    throw new Error();
  }

  abstract get [Symbol.toStringTag](): string;
}

export function isHDAddress(value: object): value is HDAddress {
  return Reflect.get(value, Symbol.toStringTag) === 'HDAddress';
}
