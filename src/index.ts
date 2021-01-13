import { Snapshot } from './key-store';

let storage: StorageRegistry | undefined;

export interface StorageRegistry {
  getKeyStore(hash: Snapshot['hash']): Promise<Snapshot | undefined>;
  setKeyStore(snapshot: Readonly<Snapshot>): Promise<void>;
  deleteKeyStore(hash: Snapshot['hash']): Promise<Snapshot>;
}

export function setStorageRegistry(registry: StorageRegistry): void {
  storage = registry;
}
