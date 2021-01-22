import { assert } from 'chai';
import 'mocha';
import * as AES128CTR from './aes-128-ctr';
import * as AES128CBC from './aes-128-cbc';
import { fromHexString, toHexString } from './utils';

describe('aes', () => {
  it('AES-128-CTR', async () => {
    const plaintext = 'TokenCoreX';
    const key = Uint8Array.of(1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4);
    const iv = Uint8Array.of(1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4);
    const encrypted = 'e19e6c5923d33c587cf8';
    assert.equal(toHexString(await AES128CTR.encrypt(new TextEncoder().encode(plaintext), key, iv)), encrypted);

    const decrypted = await AES128CTR.decrypt(fromHexString(encrypted), key, iv);
    assert.equal(new TextDecoder().decode(decrypted), plaintext);
  });

  it('AES-128-CBC', async () => {
    const plaintext = 'TokenCoreX';
    const key = Uint8Array.of(1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4);
    const iv = Uint8Array.of(1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4);
    const encrypted = '13d567987d7eced9c2154551bc37bc5f';
    assert.equal(toHexString(await AES128CBC.encrypt(new TextEncoder().encode(plaintext), key, iv)), encrypted);

    const decrypted = await AES128CBC.decrypt(fromHexString(encrypted), key, iv);
    assert.equal(new TextDecoder().decode(decrypted), plaintext);
  });
});
