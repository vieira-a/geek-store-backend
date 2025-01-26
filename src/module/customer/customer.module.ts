import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Customer, CustomerSchema } from './schema/customer.schema';
import { CustomerService } from './service/customer.service';
import { CustomerController } from './controller/customer.controller';
import { CriptographyModule } from '../shared/criptography/criptography.module';
import { WebTokenModule } from '../shared/web-token/web-token.module';
import {
  CustomerCart,
  CustomerCartSchema,
} from './schema/customer-cart.schema';
import { CartModule } from '../cart/cart.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Customer.name, schema: CustomerSchema },
      { name: CustomerCart.name, schema: CustomerCartSchema },
    ]),
    CriptographyModule,
    WebTokenModule,
    CartModule,
  ],
  providers: [CustomerService],
  controllers: [CustomerController],
})
export class CustomerModule {}
