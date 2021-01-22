import { assert } from 'chai';
import 'mocha';
import { makeKeyHash } from './key-hash';
import { toHexString } from './utils';

describe('key hash', () => {
  it('sha256 test', async () => {
    const pairs: [string, Uint8Array][] = [
      ['8de472e2399610baaa7f84840547cd409434e31f5d3bd71e4d947f283874f9c0', Uint8Array.of(1, 2, 3, 4)],
      ['26a0f059b048e922a223ff432ce9c87b13df2f25adc8e876a79a15326519fd76', new TextEncoder().encode('01020304')],
    ];
    for (const [expected, input] of pairs) {
      assert.equal(toHexString(await makeKeyHash(input)), expected);
    }
  });
});
