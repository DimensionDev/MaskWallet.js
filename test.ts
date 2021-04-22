import { request } from '@dimensiondev/mask-wallet-core';
import { api, Param } from '@dimensiondev/mask-wallet-core/proto';

function send(properties?: api.IMWRequest) {
  return api.MWResponse.decode(
    request(api.MWRequest.encode(new api.MWRequest(properties)).finish())
  );
}

console.log(
  send({
    paramImportMnemonic: new Param.ImportMnemonicStoredKeyParam({
      name: '',
      coin: Param.Coin.Ethereum,
      mnemonic: '',
      password: '',
    }),
  })
);
