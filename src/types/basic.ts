export interface CoinInfo {
  coin: string;
  derivationPath: string;
  curve: CurveType;
  network?: string;
  segWit?: string;
}

export enum CurveType {
  SECP256k1 = 'SECP256k1',
  ED25519 = 'ED25519',
  ED25519Blake2bNano = 'ED25519Blake2bNano',
  SubSr25519 = 'SubSr25519',
  Curve25519 = 'Curve25519',
  NIST256p1 = 'NIST256p1',
}

export enum KeyType {
  Mnemonic = 'Mnemonic',
  PrivateKey = 'PrivateKey',
  PublicKey = 'PublicKey',
}
