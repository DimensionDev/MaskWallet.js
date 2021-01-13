export interface CoinInfo {
  coin: string;
  derivationPath: string;
  curve: CurveType;
  network: NetworkType;
  segWit?: string;
}

export enum ChainType {
  Ethereum = 'Ethereum',
  BitcoinCash = 'BitcoinCash',
  Substrate = 'Substrate',
}

export enum NetworkType {
  MainNet = 'MainNet',
  TestNet = 'TestNet',
}

export enum CurveType {
  SECP256K1 = 'SECP256K1',
  ED25519 = 'ED25519',
  Curve25519 = 'Curve25519',
}

export enum KeyType {
  Mnemonic = 'Mnemonic',
  PrivateKey = 'PrivateKey',
}

export enum UnlockedKeyType {
  Password = 'Password',
  DeriverdKey = 'DeriverdKey',
}

export enum KeyStoreSource {
  Mnemonic = 'Mnemonic',
  PrivateKey = 'PrivateKey',
  ExcryptedJSON = 'ExcryptedJSON',
}
