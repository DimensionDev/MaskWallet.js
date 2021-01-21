export function fromHexString(input: string) {
  const matched = input.match(/[\da-f]{2}/gi);
  if (matched === null) {
    throw new Error('the string not is hex string.');
  }
  return new Uint8Array(matched.map((h) => parseInt(h, 16)));
}
