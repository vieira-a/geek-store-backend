export interface WebTokenInterface {
  sign(payload: string | object | Buffer): Promise<string>;
}
