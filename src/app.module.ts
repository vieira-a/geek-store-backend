import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongoDbModule } from './module/shared/persistence/mongodb/mongodb.module';
import { ProductModule } from './module/product/product.module';
import { CartModule } from './module/cart/cart.module';
import { CustomerModule } from './module/customer/customer.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongoDbModule,
    ProductModule,
    CartModule,
    CustomerModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
