export interface CryptographyInterface {
  hash(value: string): Promise<string>;
}
