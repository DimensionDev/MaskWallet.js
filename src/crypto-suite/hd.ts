import { assertPlainObject } from 'asserts';
import { CryptoSuiteError, KeyStore } from './types';
import { fromHexString } from './utils';

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

  driveKey(password: string): Promise<string> {
    if (this.#store.kdf === 'pbkdf2') {
      // let salt_bytes: Vec<u8> = FromHex::from_hex(&self.salt).unwrap();
      const salt = fromHexString(this.#store.kdfparams.salt);
      // pbkdf2::pbkdf2::<hmac::Hmac<sha2::Sha256>>(password, &salt_bytes, self.c as usize, out);
    } else if (this.#store.kdf === 'scrypt') {
      const salt = fromHexString(this.#store.kdfparams.salt);
      // let salt_bytes: Vec<u8> = FromHex::from_hex(&self.salt).unwrap();
      const log_n = Math.round(Math.log2(this.#store.kdfparams.n));
      // let log_n = (self.n as f64).log2().round();
      // let inner_params = scrypt::ScryptParams::new(log_n as u8, self.r, self.p).expect("init scrypt params");
      // scrypt::scrypt(password, &salt_bytes, &inner_params, out).expect("can not execute scrypt");
    }
    throw new CryptoSuiteError(`unknown keystore kdf: ${this.#store.kdf}`);
  }

  encrypt(password: string): Promise<string> {
    throw new CryptoSuiteError('Method not implemented.');
  }

  decryptPassword(password: string): Promise<string> {
    throw new CryptoSuiteError('Method not implemented.');
  }

  decryptDriverdKey(password: string): Promise<string> {
    throw new CryptoSuiteError('Method not implemented.');
  }

  verifyPassword(password: string): Promise<boolean> {
    throw new CryptoSuiteError('Method not implemented.');
  }

  verifyDriverdKey(password: string): Promise<boolean> {
    throw new CryptoSuiteError('Method not implemented.');
  }

  get [Symbol.toStringTag](): string {
    return `HDCryptoSuite(${this.#store.cipher}@${this.#store.kdf})`;
  }
}
