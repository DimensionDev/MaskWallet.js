import crypto from './driver/node';
import { CryptoSuiteError } from './types';

export const AES128CTR = Object.freeze({
  encrypt: make('AES-CTR', 'encrypt'),
  decrypt: make('AES-CTR', 'decrypt'),
});

export const AES128CBC = Object.freeze({
  encrypt: make('AES-CBC', 'encrypt'),
  decrypt: make('AES-CBC', 'decrypt'),
});

function make(name: 'AES-CTR' | 'AES-CBC', action: 'encrypt' | 'decrypt') {
  return async (data: Uint8Array, key: Uint8Array, iv: Uint8Array) => {
    if (key.length !== 16) {
      throw new CryptoSuiteError(`Invalid Key length`);
    } else if (iv.length !== 16) {
      throw new CryptoSuiteError(`Invalid IV length`);
    }
    // prettier-ignore
    const params: AesCtrParams | AesCbcParams = name === 'AES-CTR'
      ? { name: 'AES-CTR', length: 128, counter: iv,  }
      : { name: 'AES-CBC', length: 128, iv };
    const cipherkey = await crypto.subtle.importKey('raw', key, { name }, false, [action]);
    const ciphertext = await crypto.subtle[action](params, cipherkey, data);
    return new Uint8Array(ciphertext);
  };
}
