import crypto from './driver';

export async function makeKeyHash(data: Uint8Array): Promise<Uint8Array> {
  const sha256 = (data: ArrayBuffer) => crypto.subtle.digest('SHA-256', data);
  return new Uint8Array(await sha256(await sha256(data)));
}
