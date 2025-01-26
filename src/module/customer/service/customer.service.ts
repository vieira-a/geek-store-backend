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
import { CustomerCart } from '../schema/customer-cart.schema';
import { CartServiceInterface } from 'src/module/cart/interface/cart-service.interface';
import { CreateCustomerCartDto } from '../dto/create-customer-cart.dto';

@Injectable()
export class CustomerService {
  constructor(
    @InjectModel(Customer.name) private readonly customerModel: Model<Customer>,
    @InjectModel(CustomerCart.name)
    private readonly customerCartModel: Model<CustomerCart>,
    @Inject('CryptographyInterface')
    private readonly cryptographyService: CryptographyInterface,
    @Inject('WebTokenInterface')
    private readonly webTokenService: WebTokenInterface,
    @Inject('CartService')
    private readonly cartService: CartServiceInterface,
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

  async createCustomerCart(
    customerCartDto: CreateCustomerCartDto,
  ): Promise<any> {
    try {
      const { customerGsic, cartGsic } = customerCartDto;
      const customer = await this.customerModel.findOne({
        gsic: customerGsic,
      });

      if (!customer) {
        throw new CustomerException(
          'Cliente não encontrado',
          HttpStatus.NOT_FOUND,
        );
      }

      const cart = await this.cartService.findByGsic(cartGsic);

      if (!cart) {
        throw new CustomerException(
          'Carrinho não encontrado',
          HttpStatus.NOT_FOUND,
        );
      }

      const existingCustomerCart = await this.customerCartModel.findOne({
        customerId: customer.id,
        cartId: cart.id,
      });

      if (existingCustomerCart) {
        throw new CustomerException(
          'Carrinho já vinculado ao cliente',
          HttpStatus.CONFLICT,
        );
      }

      const customerCart = await this.customerCartModel.create({
        gsic: generateInternalCode('CCR'),
        customerId: customer.id,
        cartId: cart.id,
        items: cart.items,
        totalItems: cart.totalItems,
        totalPrice: cart.totalPrice,
      });

      return await customerCart.save();
    } catch (error) {
      throw error;
    }
  }
}
