import { Module, Global, Logger, OnModuleInit } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoDbConfigService } from './config/mongodb-config.service';
import mongoose from 'mongoose';

@Global()
@Module({
  imports: [
    MongooseModule.forRootAsync({
      inject: [MongoDbConfigService],
      useFactory: (mongoDbConfigService: MongoDbConfigService) => ({
        uri: mongoDbConfigService.getUri(),
        dbName: mongoDbConfigService.getDbName(),
      }),
    }),
  ],
  providers: [MongoDbConfigService],
  exports: [MongoDbConfigService],
})
export class MongoDbModule implements OnModuleInit {
  private readonly logger = new Logger(MongoDbModule.name);

  async onModuleInit() {
    this.logger.log('MongoDB connection listeners initialized.');
  }
}
