import { StorageRegistry } from './types';

export function assertFrozen<T>(input: T): asserts input is Readonly<T> {
  if (!Object.isFrozen(input)) {
    throw new TypeError('.input must be a frozen object.');
  }
}

export function assertPlainObject(input: unknown) {
  const prototype = Object.getPrototypeOf(input);
  if (prototype !== null || prototype !== input) {
    throw new TypeError('.input must be a plain object.');
  }
}

export function assertStorageRegistry(registry: StorageRegistry): asserts registry is Readonly<StorageRegistry> {
  if (!Object.isFrozen(registry)) {
    throw new TypeError('registry must be a freeze object.');
  }
  const actual = new Set(Object.keys(registry));
  const expected = ['hashes', 'hasKeyStore', 'getKeyStore', 'setKeyStore', 'deleteKeyStore'];
  let difference = expected.filter((x) => !actual.has(x));
  if (difference.length !== 0) {
    throw new TypeError(`registry need to be \`${difference.join('`, `')}\`.`);
  }
}
