import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Customer, CustomerSchema } from './schema/customer.schema';
import { CustomerService } from './service/customer.service';
import { CustomerController } from './controller/customer.controller';
import { CriptographyModule } from '../shared/criptography/criptography.module';
import { JwtModule } from '@nestjs/jwt';
import { WebTokenModule } from '../shared/web-token/web-token.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Customer.name, schema: CustomerSchema },
    ]),
    CriptographyModule,
    WebTokenModule,
  ],
  providers: [CustomerService],
  controllers: [CustomerController],
})
export class CustomerModule {}
