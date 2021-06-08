import { Coin, StoredKeyType } from './api';
import * as api from './api';

const password = 'example';

let storedKey1 = api.createStoredKey({ password: password });
let storedKey2 = api.createStoredKey({ password: password });

console.log(`mnemonic of 1st storedKey: ${storedKey1.mnemonic}`);
console.log(`mnemonic of 2nd storedKey: ${storedKey2.mnemonic}`);

const testMnemonic = 'suffer artefact burst review network fantasy easy century mom unique pupil boy';
let storedKeyImportFromMnemonic1 = api.importMnemonic({ mnemonic: testMnemonic, password: password });
let storedKeyImportFromMnemonic2 = api.importMnemonic({ mnemonic: testMnemonic, password: password });
console.log(`Hash of imported storedKey: ${storedKeyImportFromMnemonic1.StoredKey.hash}`);
console.log(`Hash of imported storedKey: ${storedKeyImportFromMnemonic2.StoredKey.hash}`);

const base_derivation_path = "m/44'/60'/0'/0/";

const startDerive = new Date().getTime();
const num_of_addresses = 1000;

for (let i = 0; i < num_of_addresses; i++) {
  const createAccountParam = {
    StoredKeyData: storedKeyImportFromMnemonic1.StoredKey.data,
    name: `account${i}`,
    coin: Coin.Ethereum,
    derivationPath: base_derivation_path + i,
    password: password,
  };
  let updatedStoredKey = api.createAccountOfCoinAtPath(createAccountParam);
  storedKeyImportFromMnemonic1.StoredKey.data = updatedStoredKey.storedKey.data;
}

let durationOfDerive = new Date().getTime() - startDerive;
console.log(`Duration of Derive: ${durationOfDerive / num_of_addresses / 1000}s`);

const allAccounts = api.getStoredKeyAllAccounts({ storedKeyData: storedKeyImportFromMnemonic1.StoredKey.data });
console.log(`Created ${allAccounts.accounts.length} accounts`);
