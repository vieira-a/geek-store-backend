import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Customer, CustomerSchema } from './schema/customer.schema';
import { CustomerService } from './service/customer.service';
import { CustomerController } from './controller/customer.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Customer.name, schema: CustomerSchema },
    ]),
  ],
  providers: [CustomerService],
  controllers: [CustomerController],
})
export class CustomerModule {}
