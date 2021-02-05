import crypto from '../driver';
import { Keccak, SHA3 } from 'sha3';

export async function makeKeyHash(data: Uint8Array) {
  return sha2$256(await sha2$256(data));
}

export async function sha2$256(data: Uint8Array) {
  return new Uint8Array(await crypto.subtle.digest('SHA-256', data));
}

export function sha3$256(data: Buffer) {
  return new SHA3(256).update(data).digest();
}

export function keccak$256(data: Buffer) {
  return new Keccak(256).update(data).digest();
}
