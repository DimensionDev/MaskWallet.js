export class CryptoSuiteError extends Error {
  readonly name = 'CryptoSuiteError';
  readonly cause?: Error;

  constructor(message: string, cause?: Error) {
    super(message);
    this.cause = cause;
    Object.freeze(this);
  }
}

export type KeyStore = KeyStore.Type;

namespace KeyStore {
  export type Type = AESCipher & KeyDerivation & { mac: string };

  export interface AESCipher {
    cipher: 'aes-128-ctr' | 'aes-128-cbc';
    cipherparams: AESCipherParams;
    ciphertext: string;
  }

  export interface AESCipherParams {
    iv: string;
  }

  export type KeyDerivation = PBKDF2 | Scrypt;

  export interface PBKDF2 {
    kdf: 'pbkdf2';
    kdfparams: PBKDF2Params;
  }

  export interface PBKDF2Params {
    c: number;
    prf: 'hmac-sha256';
    dklen: number;
    salt: string;
  }

  export interface Scrypt {
    kdf: 'scrypt';
    kdfparams: ScryptParams;
  }

  export interface ScryptParams {
    n: number;
    p: number;
    r: number;
    dklen: number;
    salt: string;
  }
}
