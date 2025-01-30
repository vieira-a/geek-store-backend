import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MongoDbConfigService {
  constructor(private readonly configService: ConfigService) {}

  getUri(): string | undefined {
    return this.configService.get<string>('MONGODB_URI');
  }

  getDbName(): string | undefined {
    return this.configService.get<string>('MONGODB_DATABASE');
  }
}
