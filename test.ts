import { importMnemonic, Coin } from './api';

const response = importMnemonic({
  name: 'example',
  coin: Coin.Ethereum,
  mnemonic: 'suffer artefact burst review network fantasy easy century mom unique pupil boy',
  password: 'example',
});

console.log(response);
