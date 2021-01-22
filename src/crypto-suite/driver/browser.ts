import { scrypt as _scrypt } from 'scrypt-js';

export default crypto;

export function scrypt(password: Uint8Array, salt: Uint8Array, N: number, r: number, p: number, dkLen: number): Promise<Uint8Array> {
  return _scrypt(password, salt, N, r, p, dkLen);
}
