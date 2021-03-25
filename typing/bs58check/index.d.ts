declare module 'bs58check' {
  interface Agent {
    encode(input: Uint8Array): string;
    decode(input: string): Uint8Array;
    decodeUnsafe(input: string): Uint8Array;
  }
  const agent: Agent;
  export = agent;
}
