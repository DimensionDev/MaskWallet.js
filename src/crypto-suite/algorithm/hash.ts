import crypto from '../driver';

export async function makeKeyHash(data: Uint8Array): Promise<Uint8Array> {
  return new Uint8Array(await sha256(await sha256(data)));
}

export function sha256(data: ArrayBuffer) {
  return crypto.subtle.digest('SHA-256', data);
}
