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

export function isHDAddress(input: object): input is HDAddress {
  return input instanceof HDAddress;
}
