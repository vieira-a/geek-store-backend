import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './schema/order.schema';
import { ProductModule } from '../product/product.module';
import { OrderService } from './service/order.service';
import { CartModule } from '../cart/cart.module';
import { CustomerModule } from '../customer/customer.module';
import { OrderController } from './controller/order.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    ProductModule,
    CartModule,
    CustomerModule,
  ],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [],
})
export class OrderModule {}
