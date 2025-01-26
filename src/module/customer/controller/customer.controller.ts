import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { CustomerService } from '../service/customer.service';
import { CreateCustomerDto } from '../dto/create-customer.dto';
import { CreateCustomerCartDto } from '../dto/create-customer-cart.dto';

@Controller('customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createCustomer(@Body() createCustomerDto: CreateCustomerDto) {
    return await this.customerService.create(createCustomerDto);
  }

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  async signin(@Body() loginDto: { email: string; password: string }) {
    return await this.customerService.login(loginDto.email, loginDto.password);
  }

  @Post('carts')
  @HttpCode(HttpStatus.CREATED)
  async createCart(@Body() createCartDto: CreateCustomerCartDto) {
    return await this.customerService.createCustomerCart(createCartDto);
  }

  @Get(':customerGsic/carts/active')
  @HttpCode(HttpStatus.OK)
  async findActiveCart(@Param('customerGsic') customerGsic: string) {
    return await this.customerService.findActiveCustomerCart(customerGsic);
  }
}
