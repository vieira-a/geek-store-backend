import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CryptographyInterface } from '../interface/criptography.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CryptographyService implements CryptographyInterface {
  constructor(private readonly configService: ConfigService) {}

  async hash(value: string): Promise<string> {
    const saltRounds = parseInt(
      this.configService.get<string>('ENCRYPT_SALT', '10'),
      10,
    );
    return bcrypt.hash(value, saltRounds || 10);
  }
}
