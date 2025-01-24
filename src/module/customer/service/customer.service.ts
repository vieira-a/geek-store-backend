import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Customer } from '../schema/customer.schema';
import { Model } from 'mongoose';
import { CreateCustomerDto } from '../dto/create-customer.dto';
import { CustomerDto } from '../dto/customer.dto';
import { generateInternalCode } from '../../../module/shared/helper/generate-internal-code.helper';

@Injectable()
export class CustomerService {
  constructor(
    @InjectModel(Customer.name) private customerModel: Model<Customer>,
  ) {}

  async create(createCustomerDto: CreateCustomerDto): Promise<CustomerDto> {
    const customer = await this.customerModel.create({
      gsic: generateInternalCode('CUR'),
      name: createCustomerDto.name,
      email: createCustomerDto.email,
      phone: createCustomerDto.phone || '',
      password: createCustomerDto.password,
    });
    const savedCustomer = await customer.save();

    return {
      name: savedCustomer.name,
      gsic: savedCustomer.gsic,
    };
  }
}
