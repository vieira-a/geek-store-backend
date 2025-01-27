import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CustomerService } from '../service/customer.service';
import { CreateCustomerDto } from '../dto/create-customer.dto';
import { CreateCustomerCartDto } from '../dto/create-customer-cart.dto';
import { CustomerAuthGuard } from 'src/module/shared/auth/guard/customer-auth.guard';

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
  @UseGuards(CustomerAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async createCart(@Body() createCartDto: CreateCustomerCartDto) {
    return await this.customerService.createCustomerCart(createCartDto);
  }

  @Get(':customerGsic/carts/active')
  @UseGuards(CustomerAuthGuard)
  @HttpCode(HttpStatus.OK)
  async findActiveCart(@Param('customerGsic') customerGsic: string) {
    return await this.customerService.findActiveCustomerCart(customerGsic);
  }
}
