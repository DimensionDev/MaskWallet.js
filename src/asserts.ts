import { CoinInfo } from 'coin-registry';
import { KeyStoreSnapshot, StorageRegistry } from './types';

export function assertFrozen<T>(input: T, message = '.input'): asserts input is Readonly<NonNullable<T>> {
  if (!Object.isFrozen(input)) {
    throw new TypeError(`${message} must be a frozen object.`);
  }
}

export function assertPlainObject<T>(input: T, message = '.input'): asserts input is NonNullable<T> {
  const prototype = Object.getPrototypeOf(input);
  if (prototype !== null || prototype !== input) {
    throw new TypeError(`${message} must be a plain object.`);
  }
}

export function assertSnapshot(snapshot: KeyStoreSnapshot | undefined, message = '.snapshot') {
  assertFrozen(snapshot, message);
  assertPlainObject(snapshot, message);
  assertPlainObject(snapshot.meta, message);
  assertPlainObject(snapshot.crypto, message);
  assertPlainObject(snapshot.pairs, message);
}

export function assertStorageRegistry(registry: StorageRegistry, message = '.registry'): asserts registry is Readonly<StorageRegistry> {
  if (!Object.isFrozen(registry)) {
    throw new TypeError(`${message} must be a frozen object.`);
  }
  const actual = new Set(Object.keys(registry));
  const expected = ['hashes', 'hasKeyStore', 'getKeyStore', 'setKeyStore', 'deleteKeyStore'];
  let difference = expected.filter((x) => !actual.has(x));
  if (difference.length !== 0) {
    throw new TypeError(`${message} need to be \`${difference.join('`, `')}\`.`);
  }
}
