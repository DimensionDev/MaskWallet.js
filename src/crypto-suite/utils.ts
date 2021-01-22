export function fromHexString(input: string) {
  if (input.length % 2 !== 0) {
    throw new Error('odd length hex string');
  }
  const values = new Uint8Array(input.length / 2);
  for (let i = 0, n = 0; i < input.length; i += 2, n++) {
    const value = Number.parseInt(input.slice(i, i + 2), 16);
    if (Number.isNaN(value)) {
      throw new Error(`invalid byte: ${input.slice(i, i + 2)} (offset: ${i})`);
    }
    values[n] = value;
  }
  return values;
}

export function toHexString(blocks: Uint8Array) {
  let encoded = '';
  for (const block of blocks) {
    encoded += block.toString(16);
  }
  return encoded;
}
