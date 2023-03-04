
export class Payload<T> {
  readonly message: string;
  readonly payload: T;
  readonly source: string;

  constructor(message: string, payload: T, source: string) {
    this.message = message;
    this.payload = payload;
    this.source = source;
  }
}
