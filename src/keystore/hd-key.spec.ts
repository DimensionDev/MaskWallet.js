import { HDKey } from './hd-key';
import 'mocha';
import { assert } from 'chai';
import validHDKeys from './fixtures/hdkey.valid.json';

describe('HDKey', () => {
  describe('+ fromMasterSeed', () => {
    for (const fixture of validHDKeys) {
      it(`should properly derive the chain path: ${fixture.path}`, async () => {
        const hdkey = await HDKey.fromMasterSeed(Buffer.from(fixture.seed, 'hex'));
        const derived = await hdkey.derive(fixture.path);
        const { xpriv, xpub } = derived.toJSON();
        assert.deepEqual(xpriv, fixture.private);
        assert.deepEqual(xpub, fixture.public);
      });
    }
  });

  describe('+ fromExtendedKey()', () => {
    const parentFingerprint = 0x31a507b8;

    it('should parse it (when private)', async () => {
      // m/0/2147483647'/1/2147483646'/2
      const key = 'xprvA2nrNbFZABcdryreWet9Ea4LvTJcGsqrMzxHx98MMrotbir7yrKCEXw7nadnHM8Dq38EGfSh6dqA9QWTyefMLEcBYJUuekgW4BYPJcr9E7j';
      const hdkey = await HDKey.fromExtendedKey(key);
      assert.deepEqual(hdkey.versions.private, 0x0488ade4);
      assert.deepEqual(hdkey.versions.public, 0x0488b21e);
      assert.deepEqual(hdkey.depth, 5);
      assert.deepEqual(hdkey.parentFingerprint, parentFingerprint);
      assert.deepEqual(hdkey.index, 2);
      assert.deepEqual(hdkey.chainCode, Buffer.from('9452b549be8cea3ecb7a84bec10dcfd94afe4d129ebfd3b3cb58eedf394ed271', 'hex'));
      assert.deepEqual(hdkey.getPrivateKey(), Buffer.from('bb7d39bdb83ecf58f2fd82b6d918341cbef428661ef01ab97c28a4842125ac23', 'hex'));
      assert.deepEqual(hdkey.getPublicKey(), Buffer.from('024d902e1a2fc7a8755ab5b694c575fce742c48d9ff192e63df5193e4c7afe1f9c', 'hex'));
      // assert.deepEqual(hdkey.identifier, Buffer.from('26132fdbe7bf89cbc64cf8dafa3f9f88b8666220', 'hex'));
    });

    it('should parse it (when public)', async () => {
      // m/0/2147483647'/1/2147483646'/2
      const key = 'xpub6FnCn6nSzZAw5Tw7cgR9bi15UV96gLZhjDstkXXxvCLsUXBGXPdSnLFbdpq8p9HmGsApME5hQTZ3emM2rnY5agb9rXpVGyy3bdW6EEgAtqt';
      const hdkey = await HDKey.fromExtendedKey(key);
      assert.deepEqual(hdkey.versions.private, 0x0488ade4);
      assert.deepEqual(hdkey.versions.public, 0x0488b21e);
      assert.deepEqual(hdkey.depth, 5);
      assert.deepEqual(hdkey.parentFingerprint, parentFingerprint);
      assert.deepEqual(hdkey.index, 2);
      assert.deepEqual(hdkey.chainCode, Buffer.from('9452b549be8cea3ecb7a84bec10dcfd94afe4d129ebfd3b3cb58eedf394ed271', 'hex'));
      assert.lengthOf(hdkey.getPrivateKey(), 0);
      assert.deepEqual(hdkey.getPublicKey(), Buffer.from('024d902e1a2fc7a8755ab5b694c575fce742c48d9ff192e63df5193e4c7afe1f9c', 'hex'));
      // assert.deepEqual(hdkey.identifier, Buffer.from('26132fdbe7bf89cbc64cf8dafa3f9f88b8666220', 'hex'));
    });
  });
});
