import { Module } from '@nestjs/common';
import { ProductModule } from '../product/product.module';
import { CartService } from './service/cart.service';
import { CartController } from './controller/cart.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Cart, CartSchema } from './schema/cart.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Cart.name, schema: CartSchema }]),
    ProductModule,
  ],
  providers: [CartService],
  controllers: [CartController],
})
export class CartModule {}
