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

declare namespace KeyStore {
  type Type = AESCipher & KeyDerivation & { mac: string };

  interface AESCipher {
    cipher: 'aes-128-ctr' | 'aes-128-cbc';
    cipherparams: AESCipherParams;
    ciphertext: string;
  }

  interface AESCipherParams {
    iv: string;
  }

  type KeyDerivation = PBKDF2 | Scrypt;

  interface PBKDF2 {
    kdf: 'pbkdf2';
    kdfparams: PBKDF2Params;
  }

  interface PBKDF2Params {
    c: number;
    prf: 'hmac-sha256';
    dklen: number;
    salt: string;
  }

  interface Scrypt {
    kdf: 'scrypt';
    kdfparams: ScryptParams;
  }

  interface ScryptParams {
    n: number;
    p: number;
    r: number;
    dklen: number;
    salt: string;
  }
}
