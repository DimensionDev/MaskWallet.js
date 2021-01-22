import { assert, use } from 'chai';
import 'mocha';
import { decrypt, encrypt } from './aes';
import { fromHexString, toHexString } from './utils';

describe('aes', () => {
  it('AES-128-CTR', async () => {
    const plaintext = 'TokenCoreX';
    const key = Uint8Array.of(1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4);
    const iv = Uint8Array.of(1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4);
    const encrypted = 'e19e6c5923d33c587cf8';
    assert.equal(toHexString(await encrypt(new TextEncoder().encode(plaintext), key, iv)), encrypted);

    const decrypted = await decrypt(fromHexString(encrypted), key, iv);
    assert.equal(new TextDecoder().decode(decrypted), plaintext);
  });
});
