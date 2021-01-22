import crypto from './driver/node';
import { CryptoSuiteError } from './types';

const name = 'AES-CTR';
const length = 128;

export async function encrypt(data: Uint8Array, key: Uint8Array, iv: Uint8Array) {
  if (key.length !== 16 || iv.length !== 16) {
    throw new CryptoSuiteError('Invalid key or iv length');
  }
  const encrypted = await crypto.subtle.encrypt({ name, counter: iv, length }, await importKey(key), data);
  return new Uint8Array(encrypted);
}

export async function decrypt(data: Uint8Array, key: Uint8Array, iv: Uint8Array) {
  if (key.length !== 16 || iv.length !== 16) {
    throw new CryptoSuiteError('Invalid key or iv length');
  }
  const decrypted = await crypto.subtle.decrypt({ name, counter: iv, length }, await importKey(key), data);
  return new Uint8Array(decrypted);
}

function importKey(key: Uint8Array) {
  return crypto.subtle.importKey('raw', key, { name }, false, ['encrypt', 'decrypt']);
}
