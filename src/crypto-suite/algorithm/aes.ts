import crypto from '../driver';

interface AESOperation {
  encrypt(data: Uint8Array, key: Uint8Array, iv: Uint8Array): Promise<Uint8Array>;
  decrypt(data: Uint8Array, key: Uint8Array, iv: Uint8Array): Promise<Uint8Array>;
}

export const AES128CTR = Object.freeze<AESOperation>({
  encrypt: make('AES-CTR', 'encrypt'),
  decrypt: make('AES-CTR', 'decrypt'),
});

export const AES128CBC = Object.freeze<AESOperation>({
  encrypt: make('AES-CBC', 'encrypt'),
  decrypt: make('AES-CBC', 'decrypt'),
});

function make(name: 'AES-CTR' | 'AES-CBC', usage: 'encrypt' | 'decrypt') {
  return async (data: Uint8Array, key: Uint8Array, iv: Uint8Array) => {
    if (key.length !== 16) {
      throw new Error(`${name}: invalid key length (${usage})`);
    } else if (iv.length !== 16) {
      throw new Error(`${name}: invalid iv length (${usage})`);
    }
    // prettier-ignore
    const params = name === 'AES-CTR'
      ? <AesCtrParams>{ name, length: 128, counter: iv }
      : <AesCbcParams>{ name, length: 128, iv };
    const cipherkey = await crypto.subtle.importKey('raw', key, { name }, false, [usage]);
    const ciphertext = await crypto.subtle[usage](params, cipherkey, data);
    return new Uint8Array(ciphertext);
  };
}
