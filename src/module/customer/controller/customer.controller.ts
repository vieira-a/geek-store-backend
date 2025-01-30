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
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CustomerService } from '../service/customer.service';
import { CreateCustomerDto } from '../dto/create-customer.dto';
import { CreateCustomerCartDto } from '../dto/create-customer-cart.dto';
import { CustomerAuthGuard } from 'src/module/shared/auth/guard/customer-auth.guard';

@ApiTags('Customers')
@Controller('customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post()
  @ApiOperation({ summary: 'Criar um novo cliente' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Cliente criado com sucesso',
    type: CreateCustomerDto,
  })
  @HttpCode(HttpStatus.CREATED)
  async createCustomer(@Body() createCustomerDto: CreateCustomerDto) {
    return await this.customerService.create(createCustomerDto);
  }

  @Post('signin')
  @ApiOperation({ summary: 'Autenticar um cliente' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Login bem-sucedido',
    schema: {
      example: {
        accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      },
    },
  })
  @HttpCode(HttpStatus.OK)
  async signin(@Body() loginDto: { email: string; password: string }) {
    return await this.customerService.login(loginDto.email, loginDto.password);
  }

  @Post('carts')
  @UseGuards(CustomerAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Criar um carrinho para o cliente autenticado' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Carrinho criado com sucesso',
    type: CreateCustomerCartDto,
  })
  @HttpCode(HttpStatus.CREATED)
  async createCart(@Body() createCartDto: CreateCustomerCartDto) {
    return await this.customerService.createCustomerCart(createCartDto);
  }

  @Get(':customerGsic/carts/active')
  @UseGuards(CustomerAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Buscar carrinho ativo do cliente' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Carrinho ativo encontrado',
    schema: {
      example: {
        id: '12345',
        customerGsic: 'GSIC67890',
        items: [{ slug: 'camiseta-star-wars', gsic: 'GSIC12345', quantity: 2 }],
        status: 'active',
      },
    },
  })
  @HttpCode(HttpStatus.OK)
  async findActiveCart(@Param('customerGsic') customerGsic: string) {
    return await this.customerService.findActiveCustomerCart(customerGsic);
  }
}
