import { request } from '@dimensiondev/mask-wallet-core';
import { api } from '@dimensiondev/mask-wallet-core/proto';

type Request = InstanceType<typeof api.MWRequest>;
type Response = InstanceType<typeof api.MWResponse>;

function send<I extends keyof Request, O extends keyof Response>(input: I, output: O) {
  return (value: Request[I]) => {
    const payload = api.MWRequest.encode({ [input]: value }).finish();
    const response = api.MWResponse.decode(request(payload));
    if (response.error) {
      throw new Error(response.error.errorMsg);
    }
    return response[output];
  };
}

export const Coin = api.Coin;
export const StoredKeyType = api.StoredKeyType;

export const loadStoredKey = send('param_load_stored_key', 'resp_load_stored_key');
export const createStoredKey = send('param_create_stored_key', 'resp_create_stored_key');
export const importPrivateKey = send('param_import_private_key', 'resp_import_private_key');
export const importMnemonic = send('param_import_mnemonic', 'resp_import_mnemonic');
export const importJSON = send('param_import_json', 'resp_import_json');
export const getStoredKeyAccountCount = send('param_get_stored_key_account_count', 'resp_get_stored_key_account_count');
export const getStoredKeyAccount = send('param_get_stored_key_account', 'resp_get_stored_key_account');
export const getStoredKeyAllAccounts = send('param_get_stored_key_all_accounts', 'resp_get_stored_key_all_accounts');
export const getStoredKeyAccountsOfCoin = send('param_get_stored_key_accounts_of_coin', 'resp_remove_account_of_coin');
export const getStoredKeyAccountsOfCoinAtPath = send('param_create_acccount_of_coin_at_path', 'resp_create_account_of_coin_at_path');
export const removeAccountsOfCoin = send('param_remove_accounts_of_coin', 'resp_remove_account_of_coin');
export const removeAccountOfAddress = send('param_remove_account_of_address', 'resp_remove_account_of_address');
export const exportPrivateKey = send('param_export_private_key', 'resp_export_private_key');
export const exportPrivateKeyOfPath = send('param_export_private_key_of_path', 'resp_export_private_key');
export const exportMnemonic = send('param_export_mnemonic', 'resp_export_mnemonic');
export const exportKeyStoreJSON = send('param_export_key_store_json', 'resp_export_key_store_json');
export const exportKeyStoreJSONOfPath = send('param_export_key_store_json_of_path', 'resp_export_key_store_json');
export const signTransaction = send('param_sign_transaction', 'resp_sign_transaction');
