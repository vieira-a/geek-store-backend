import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Customer } from '../schema/customer.schema';
import { Model } from 'mongoose';
import { CreateCustomerDto } from '../dto/create-customer.dto';
import { CustomerDto } from '../dto/customer.dto';
import { generateInternalCode } from '../../../module/shared/helper/generate-internal-code.helper';
import { CryptographyInterface } from '../../../module/shared/criptography/interface/criptography.interface';
import { CustomerException } from '../exception/customer.exception';

@Injectable()
export class CustomerService {
  constructor(
    @InjectModel(Customer.name) private customerModel: Model<Customer>,
    @Inject('CryptographyInterface')
    private cryptographyService: CryptographyInterface,
  ) {}

  async create(createCustomerDto: CreateCustomerDto): Promise<CustomerDto> {
    if (createCustomerDto.password !== createCustomerDto.passwordConfirmation) {
      throw new CustomerException(
        'Senhas não conferem',
        HttpStatus.BAD_REQUEST,
      );
    }
    const encryptedPassword = await this.cryptographyService.hash(
      createCustomerDto.password,
    );
    const customer = await this.customerModel.create({
      gsic: generateInternalCode('CUR'),
      name: createCustomerDto.name,
      email: createCustomerDto.email,
      phone: createCustomerDto.phone || '',
      password: encryptedPassword,
    });
    const savedCustomer = await customer.save();

    return {
      name: savedCustomer.name,
      gsic: savedCustomer.gsic,
    };
  }
}
