import { assertPlainObject, assertSnapshot } from '../asserts';
import { CoinInfo } from '../coin-registry';
import { CryptoKey, KeyStore, PrivateKey, PublicKey } from '../crypto-suite';
import { ChainType, ImportKeyStoreParams, KeyPair, KeyStoreSnapshot, KeyStoreType, KeyType, UnlockKeyType } from '../types';

type UnlockedStore = readonly [UnlockKeyType, string];

export class HDKeyStore {
  #store: UnlockedStore | null = null;
  #hash: KeyStoreSnapshot['hash'];
  #crypto: KeyStore;
  #meta: KeyStoreSnapshot['meta'];
  #pairs: KeyStoreSnapshot['pairs'];

  static async create(params: ImportKeyStoreParams): Promise<HDKeyStore> {
    assertPlainObject(params, '`params` parameter');
    if (params.type !== KeyStoreType.HD) {
      throw new Error('`.kind` must be is HDKeyStore');
    }
    throw new Error('not implemented');
  }

  constructor(snapshot: KeyStoreSnapshot) {
    assertSnapshot(snapshot);
    if (snapshot.type !== KeyStoreType.HD) {
      throw new Error('unsupported snapshot type');
    }
    this.#hash = snapshot.hash;
    this.#crypto = { ...snapshot.crypto };
    this.#meta = { ...snapshot.meta };
    this.#pairs = Array.from(snapshot.pairs).map(cloneKeyPair);
    Object.freeze(this);
  }

  // #region locker
  isLocked() {
    return this.#store === null;
  }

  lock() {
    this.#store = null;
  }

  async unlock(type: UnlockKeyType, value: string) {
    // TODO: verify unlock data correctness
    this.#store = Object.freeze<UnlockedStore>([type, value]);
    return true;
  }

  private assertUnlocked() {
    if (this.isLocked()) {
      throw new Error('This key store need unlock.');
    }
  }
  // #endregion

  async derive(info: CoinInfo): Promise<KeyPair> {
    this.assertUnlocked();
    throw new Error('not implemented');
  }

  async find(type: KeyType.DeterministicPublicKey, chainType: ChainType, address: string): Promise<PublicKey>;
  async find(type: KeyType.PrivateKey, chainType: ChainType, address: string, path?: string): Promise<PrivateKey>;
  async find(type: KeyType, chainType: ChainType, address: string, path?: string): Promise<CryptoKey> {
    if (type !== KeyType.PublicKey) this.assertUnlocked();
    throw new Error('not implemented');
  }

  async exportMnemonic(): Promise<string> {
    this.assertUnlocked();
    throw new Error('not implemented');
  }

  async exportPrivateKey(chainType: ChainType, mainAddress: string, path?: string): Promise<string> {
    this.assertUnlocked();
    throw new Error('not implemented');
  }

  async deriveKey(info: CoinInfo): Promise<KeyPair> {
    this.assertUnlocked();
    throw new Error('not implemented');
  }

  getKeyPair(chainType: ChainType, address: string): Readonly<KeyPair | undefined> {
    const pair = this.#pairs.find((pair) => pair.chainType === chainType && pair.address === address);
    return pair ? cloneKeyPair(pair) : undefined;
  }

  getAllKeyPairs(): ReadonlyArray<KeyPair> {
    return Object.freeze(Array.from(this.#pairs).map(cloneKeyPair));
  }

  async sign(source: BufferSource, chainType: ChainType, address: string, path?: string): Promise<string> {
    this.assertUnlocked();
    throw new Error('not implemented');
  }

  async signRecoverableHash(source: BufferSource, chainType: ChainType, address: string, path?: string): Promise<string> {
    this.assertUnlocked();
    throw new Error('not implemented');
  }

  get keyHash() {
    return this.#hash;
  }

  toJSON(): Readonly<KeyStoreSnapshot> {
    return Object.freeze({
      version: 1,
      type: KeyStoreType.HD,
      hash: this.#hash,
      pairs: this.#pairs,
      crypto: this.#crypto,
      meta: this.#meta,
    });
  }

  get [Symbol.toStringTag]() {
    return 'HDKeyStore';
  }
}

export function isHDKeyStore(value: object): value is HDKeyStore {
  return Reflect.get(value, Symbol.toStringTag) === 'HDKeyStore';
}

function cloneKeyPair(pair: KeyPair): Readonly<KeyPair> {
  return Object.freeze<KeyPair>({
    chainType: pair.chainType,
    address: pair.address,
    derivationPath: pair.derivationPath,
    curve: pair.curve,
    network: pair.network,
    segWit: pair.segWit,
    extendedPublicKey: pair.extendedPublicKey,
  });
}
