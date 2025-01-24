import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongoDbModule } from './module/shared/persistence/mongodb/mongodb.module';
import { ProductModule } from './module/product/product.module';
import { CartModule } from './module/cart/cart.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongoDbModule,
    ProductModule,
    CartModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
