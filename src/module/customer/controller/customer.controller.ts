import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { CustomerService } from '../service/customer.service';
import { CreateCustomerDto } from '../dto/create-customer.dto';

@Controller('customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createCustomer(@Body() createCustomerDto: CreateCustomerDto) {
    return await this.customerService.create(createCustomerDto);
  }
}
