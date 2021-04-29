import { request } from '@dimensiondev/mask-wallet-core';
import { api, Param } from '@dimensiondev/mask-wallet-core/proto';

function send<T extends keyof api.IMWRequest>(name: T, value: api.IMWRequest[T]) {
  const message = new api.MWRequest({ [name]: value });
  const payload = api.MWRequest.encode(message).finish();
  const response = api.MWResponse.decode(request(payload));
  // if (response.error) {
  //   throw new Error(response.error.errorMsg);
  // }
  return response;
}

const password = 'example';
const importMnemonic = new Param.ImportMnemonicStoredKeyParam({
  name: 'example',
  coin: Param.Coin.Ethereum,
  mnemonic: 'suffer artefact burst review network fantasy easy century mom unique pupil boy',
  password: password,
});

var base_derivation_path = "m/44'/60'/0'/0/";
// 1. Start Import Mnemonic
const startImport = new Date().getTime();
const importResp = send('param_import_mnemonic', importMnemonic);
let durationOfImport = new Date().getTime() - startImport;
console.log(importResp);
console.log(`Duration of import mnemonic: ${durationOfImport / 1000}s`);

var stored_key_data = importResp.resp_import_mnemonic.StoredKey.data;
const startDerive = new Date().getTime();
const num_of_addresses = 100;
for (let i = 0; i < num_of_addresses; i++) {
  let path = base_derivation_path + i;
  // console.log('creating path: ' + path);
  const addNewAddress = new Param.CreateStoredKeyNewAccountParam({
    StoredKeyData: stored_key_data,
    coin: Param.Coin.Ethereum,
    derivationPath: base_derivation_path + i,
    password: password,
  });

  // console.log(addNewAddress);
  const addNewAccountResp = send('param_create_acccount_of_coin_at_path', addNewAddress);
  // console.log(addNewAccountResp);
  stored_key_data = addNewAccountResp.resp_create_account_of_coin_at_path.storedKey.data;
  // console.log('-------------------------------------');
}
let durationOfDerive = new Date().getTime() - startDerive;
console.log(`Duration of Derive: ${durationOfDerive / num_of_addresses / 1000}s`);

const getAllAccounts = new Param.GetStoredKeyAllAccountParam({
  data: stored_key_data,
});
const getAllAccountsResp = send('param_get_stored_key_all_accounts', getAllAccounts);
// console.log(getAllAccountsResp.resp_get_stored_key_all_accounts.accounts);
