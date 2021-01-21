export class CryptoSuiteError extends Error {
  readonly name = 'CryptoSuiteError';
  readonly cause?: Error;

  constructor(message: string, cause?: Error) {
    super(message);
    this.cause = cause;
    Object.freeze(this);
  }
}
