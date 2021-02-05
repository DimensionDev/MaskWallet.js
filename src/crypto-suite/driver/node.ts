import crypto from 'crypto';

export default crypto.webcrypto;

export function scrypt(password: Uint8Array, salt: Uint8Array, N: number, r: number, p: number, dkLen: number): Promise<Uint8Array> {
  return new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, dkLen, { N, r, p }, (err, key) => {
      if (err) {
        reject(err);
      } else {
        resolve(key);
      }
    });
  });
}
