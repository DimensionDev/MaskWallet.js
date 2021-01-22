import crypto from './driver';
import { CryptoSuiteError } from './types';

export async function encrypt(data: Uint8Array, key: Uint8Array, iv: Uint8Array) {
  if (key.length !== 16 || iv.length !== 16) {
    throw new CryptoSuiteError('Invalid key or iv length');
  }
  const encrypted = await crypto.subtle.encrypt(
    {
      name: 'AES-CTR',
      counter: iv,
      length: 128,
    },
    await importKey(key, 'AES-CTR'),
    data
  );
  return new Uint8Array(encrypted);
}

export async function decrypt(data: Uint8Array, key: Uint8Array, iv: Uint8Array) {
  if (key.length !== 16 || iv.length !== 16) {
    throw new CryptoSuiteError('Invalid key or iv length');
  }
  const decrypted = await crypto.subtle.decrypt(
    {
      name: 'AES-CTR',
      counter: iv,
      length: 128,
    },
    await importKey(key, 'AES-CTR'),
    data
  );
  return new Uint8Array(decrypted);
}

function importKey(key: Uint8Array, name: 'AES-CTR' | 'AES-CBC') {
  return crypto.subtle.importKey('raw', key, { name: name }, false, ['encrypt', 'decrypt']);
}
