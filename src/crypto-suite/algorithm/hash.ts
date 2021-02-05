import crypto from '../driver';
import { Keccak, SHA3 } from 'sha3';

export async function makeKeyHash(data: Uint8Array): Promise<Uint8Array> {
  return new Uint8Array(await sha2$256(await sha2$256(data)));
}

export function sha2$256(data: ArrayBuffer) {
  return crypto.subtle.digest('SHA-256', data);
}

export function sha3$256(data: Buffer) {
  return new SHA3(256).update(data).digest();
}

export function keccak$256(data: Buffer) {
  return new Keccak(256).update(data).digest();
}
