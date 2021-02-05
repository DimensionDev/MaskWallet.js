import Arweave from 'arweave';
import Transaction from 'arweave/node/lib/transaction';
import { JWKInterface, JWKPublicInterface } from 'arweave/node/lib/wallet';
import { PrivateKey, PublicKey } from './types';

const arweave = new Arweave({});

export class ArweavePublicKey extends PublicKey {
  #key: JWKPublicInterface;

  constructor(jwk: JWKPublicInterface) {
    super('ArweavePublicKey');
    this.#key = jwk;
    Object.freeze(this);
  }

  toString() {
    return this.#key.n!;
  }
}

export class ArweavePrivateKey extends PrivateKey<Transaction, void> {
  #key: JWKInterface;

  constructor(jwk: JWKInterface) {
    super('ArweavePrivateKey');
    this.#key = jwk;
    Object.freeze(this);
  }

  getPublicKey() {
    return new ArweavePublicKey({
      kty: this.#key.kty,
      n: this.#key.n,
      e: this.#key.e,
    });
  }

  sign(transaction: Transaction) {
    if (!(transaction instanceof Transaction)) {
      throw new Error('The `transaction` object not is Arweave Transaction');
    }
    return arweave.transactions.sign(transaction, this.#key);
  }

  signRecoverable(transaction: Transaction): Promise<void> {
    throw new Error('The arweave not supported recoerable sign.');
  }

  toString(): string {
    return this.#key.n!;
  }
}
