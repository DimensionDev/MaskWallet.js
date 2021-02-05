import { assertPlainObject } from '../asserts';
import { fromHexString } from '../utils/hex';
import crypto, { scrypt } from './driver';
import { CryptoSuiteError, KeyStore } from './types';

export class HDCryptoSuite {
  #store: KeyStore;
  #password: Uint8Array;

  static from(store: KeyStore, password: Uint8Array) {
    assertPlainObject(store, 'store');
    assertPlainObject(store.cipherparams, 'store.cipherparams');
    assertPlainObject(store.kdfparams, 'store.kdfparams');
    if (!(store.kdf === 'pbkdf2' || store.kdf === 'scrypt')) {
      throw new CryptoSuiteError('unsupported key store type');
    }
    return new this(store, password);
  }

  private constructor(store: KeyStore, password: Uint8Array) {
    this.#store = store;
    this.#password = password;
    Object.freeze(this);
  }

  async driveKey(password: Uint8Array): Promise<Uint8Array> {
    let salt;
    try {
      salt = fromHexString(this.#store.kdfparams.salt);
    } catch (err) {
      throw new CryptoSuiteError('parsing kdfparams.salt failed', err);
    }
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
    this.assertPassword(password);
    throw new CryptoSuiteError('Method not implemented.');
  }

  decryptPassword(password: Uint8Array): Promise<Uint8Array> {
    this.assertPassword(password);
    throw new CryptoSuiteError('Method not implemented.');
  }

  decryptDriverdKey(key: Uint8Array): Promise<Uint8Array> {
    throw new CryptoSuiteError('Method not implemented.');
  }

  verifyPassword(password: Uint8Array): Promise<boolean> {
    this.assertPassword(password);
    throw new CryptoSuiteError('Method not implemented.');
  }

  verifyDriverdKey(key: Uint8Array): Promise<boolean> {
    throw new CryptoSuiteError('Method not implemented.');
  }

  assertPassword(password: Uint8Array) {
    if (!Buffer.from(this.#password).equals(password)) {
      throw new CryptoSuiteError('PasswordIncorrect');
    }
  }

  get [Symbol.toStringTag](): string {
    return 'HDCryptoSuite';
  }
}
