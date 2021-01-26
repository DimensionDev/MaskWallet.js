import { assert } from 'chai';
import 'mocha';
import { fromHexString, toHexString } from 'utils';
import { makeKeyHash } from './key-hash';

describe('key hash', () => {
  it('SHA2-256', async () => {
    const pairs: [string, Uint8Array][] = [
      ['8de472e2399610baaa7f84840547cd409434e31f5d3bd71e4d947f283874f9c0', fromHexString('01020304')],
      ['26a0f059b048e922a223ff432ce9c87b13df2f25adc8e876a79a15326519fd76', new TextEncoder().encode('01020304')],
    ];
    for (const [expected, input] of pairs) {
      assert.equal(toHexString(await makeKeyHash(input)), expected);
    }
  });
});
