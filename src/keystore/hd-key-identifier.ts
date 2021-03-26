import { createHash } from 'crypto';

export async function hash160(buf: Uint8Array): Promise<Uint8Array> {
  const sha = createHash('sha256').update(buf).digest();
  return createHash('ripemd160').update(sha).digest();
}
