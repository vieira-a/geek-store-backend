import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CryptographyInterface } from '../interface/criptography.interface';

@Injectable()
export class CryptographyService implements CryptographyInterface {
  private readonly saltRounds = 10;

  async hash(value: string): Promise<string> {
    return bcrypt.hash(value, this.saltRounds);
  }
}
