import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Customer } from '../schema/customer.schema';
import { Model } from 'mongoose';
import { CreateCustomerDto } from '../dto/create-customer.dto';
import { CustomerAuthenticatedDto, CustomerDto } from '../dto/customer.dto';
import { generateInternalCode } from '../../../module/shared/helper/generate-internal-code.helper';
import { CryptographyInterface } from '../../../module/shared/criptography/interface/criptography.interface';
import { CustomerException } from '../exception/customer.exception';
import { WebTokenInterface } from 'src/module/shared/web-token/interface/web-token.inteface';

@Injectable()
export class CustomerService {
  constructor(
    @InjectModel(Customer.name) private readonly customerModel: Model<Customer>,
    @Inject('CryptographyInterface')
    private readonly cryptographyService: CryptographyInterface,
    @Inject('WebTokenInterface')
    private readonly webTokenService: WebTokenInterface,
  ) {}

  async create(createCustomerDto: CreateCustomerDto): Promise<CustomerDto> {
    if (createCustomerDto.password !== createCustomerDto.passwordConfirmation) {
      throw new CustomerException(
        'Senhas não conferem',
        HttpStatus.BAD_REQUEST,
      );
    }

    const customerExists = await this.customerModel.findOne({
      email: createCustomerDto.email,
    });

    if (customerExists) {
      throw new CustomerException('E-mail já cadastrado', HttpStatus.CONFLICT);
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

  async login(
    email: string,
    password: string,
  ): Promise<CustomerAuthenticatedDto> {
    const customer = await this.customerModel.findOne({ email });
    if (!customer) {
      throw new CustomerException(
        'Usuário não encontrado',
        HttpStatus.NOT_FOUND,
      );
    }

    const passwordMatch = await this.cryptographyService.compare(
      password,
      customer.password,
    );

    if (!passwordMatch) {
      throw new CustomerException('Senha incorreta', HttpStatus.UNAUTHORIZED);
    }

    const token = await this.webTokenService.sign({ email: customer.email });
    return {
      customer: {
        name: customer.name,
        gsic: customer.gsic,
        email: customer.email,
      },
      token,
    };
  }
}
