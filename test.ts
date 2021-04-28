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

const importMnemonic = new Param.ImportMnemonicStoredKeyParam({
  name: 'example',
  coin: Param.Coin.Ethereum,
  mnemonic: 'suffer artefact burst review network fantasy easy century mom unique pupil boy',
  password: 'example',
});

console.log(send('param_import_mnemonic', importMnemonic));
