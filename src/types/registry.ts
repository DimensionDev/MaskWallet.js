import { KeyStoreSnapshot } from './keystore';

export interface KeyStoreRegistry {
  hashes(): AsyncGenerator<KeyStoreSnapshot['hash'], void, unknown>;
  getKeyStore(hash: KeyStoreSnapshot['hash']): Promise<Readonly<KeyStoreSnapshot> | undefined>;
  setKeyStore(hash: KeyStoreSnapshot['hash'], snapshot: Readonly<KeyStoreSnapshot | undefined>): Promise<void>;
}

export class KeyStoreAgent implements KeyStoreRegistry {
  #registry: KeyStoreRegistry;

  constructor(registry: KeyStoreRegistry) {
    if (!Object.isFrozen(registry)) {
      throw new TypeError(`key store registry must be a frozen object.`);
    }
    const actual = new Set(Object.keys(registry));
    const expected = ['hashes', 'getKeyStore', 'setKeyStore'];
    const difference = expected.filter((x) => !actual.has(x));
    if (difference.length !== 0) {
      throw new TypeError(`key store registry need to be ${JSON.stringify(difference)}.`);
    }
    this.#registry = registry;
    Object.freeze(this);
  }

  hashes: KeyStoreRegistry['hashes'] = () => this.#registry.hashes();

  getKeyStore: KeyStoreRegistry['getKeyStore'] = (hash) => this.#registry.getKeyStore(hash);

  setKeyStore: KeyStoreRegistry['setKeyStore'] = (hash, snapshot) => this.#registry.setKeyStore(hash, snapshot);

  async assertKeyStoreAvailable(hash: KeyStoreSnapshot['hash']) {
    if (!(await this.#registry.getKeyStore(hash))) {
      throw new Error(`The ${hash} key store not found.`);
    }
  }

  async clear() {
    const registry = this.#registry;
    for await (const hash of registry.hashes()) {
      await registry.setKeyStore(hash, undefined);
    }
  }
}
