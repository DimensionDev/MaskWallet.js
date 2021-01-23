import { assertPlainObject } from 'asserts';
import { CryptoSuiteError, KeyStore } from './types';
import { fromHexString } from './utils';
import crypto, { scrypt } from './driver';

export class HDCryptoSuite {
  #store: KeyStore;

  constructor(store: KeyStore) {
    assertPlainObject(store, 'store');
    assertPlainObject(store.cipherparams, 'store.cipherparams');
    assertPlainObject(store.kdfparams, 'store.kdfparams');
    if (!(store.kdf === 'pbkdf2' || store.kdf === 'scrypt')) {
      throw new CryptoSuiteError('unsupported key store type');
    }
    this.#store = store;
    Object.freeze(this);
  }

  async driveKey(password: Uint8Array): Promise<Uint8Array> {
    const salt = fromHexString(this.#store.kdfparams.salt);
    if (this.#store.kdf === 'pbkdf2' && this.#store.kdfparams.prf === 'hmac-sha256') {
      const iterations = this.#store.kdfparams.c;
      const derivedBits = await crypto.subtle.deriveBits(
        { name: 'PBKDF2', hash: 'SHA-256', salt, iterations },
        await crypto.subtle.importKey('raw', password, { name: 'PBKDF2' }, false, ['deriveBits']),
        this.#store.kdfparams.dklen
      );
      return new Uint8Array(derivedBits);
    } else if (this.#store.kdf === 'scrypt') {
      const n = Math.round(Math.log2(this.#store.kdfparams.n));
      return scrypt(password, salt, n, this.#store.kdfparams.r, this.#store.kdfparams.p, this.#store.kdfparams.dklen);
    }
    throw new CryptoSuiteError('Unsupported Key Store');
  }

  encrypt(password: Uint8Array): Promise<Uint8Array> {
    throw new CryptoSuiteError('Method not implemented.');
  }

  decryptPassword(password: Uint8Array): Promise<Uint8Array> {
    throw new CryptoSuiteError('Method not implemented.');
  }

  decryptDriverdKey(password: Uint8Array): Promise<Uint8Array> {
    throw new CryptoSuiteError('Method not implemented.');
  }

  verifyPassword(password: Uint8Array): Promise<boolean> {
    throw new CryptoSuiteError('Method not implemented.');
  }

  verifyDriverdKey(password: Uint8Array): Promise<boolean> {
    throw new CryptoSuiteError('Method not implemented.');
  }

  get [Symbol.toStringTag](): string {
    return `HDCryptoSuite(${this.#store.cipher}@${this.#store.kdf})`;
  }
}
