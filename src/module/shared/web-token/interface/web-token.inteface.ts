export interface WebTokenInterface {
  sign(payload: string | object | Buffer): Promise<string>;
  verify(token: string): Promise<string | object>;
}
