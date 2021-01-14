export class WalletError extends Error {
  public readonly cause?: Error;

  public constructor(message: string, cause?: Error) {
    super(message);
    this.cause = cause;
    Object.freeze(this);
  }
}
