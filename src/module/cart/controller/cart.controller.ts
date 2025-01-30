import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { CartService } from '../service/cart.service';
import { CreateCartDto } from '../dto/create-cart.dto';
import { UpdateCartDto } from '../dto/update-cart.dto';

@Controller('carts')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Criar um novo carrinho' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Carrinho criado com sucesso',
    type: CreateCartDto,
  })
  async createCart(@Body() createCartDto: CreateCartDto) {
    return this.cartService.create(createCartDto);
  }

  @Patch(':sessionId/:gsic')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Atualizar carrinho' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Carrinho atualizado com sucesso',
    type: UpdateCartDto,
  })
  @ApiParam({ name: 'sessionId', description: 'ID da sessão do carrinho' })
  @ApiParam({
    name: 'gsic',
    description: 'Código interno do produto no carrinho',
  })
  async updateCart(
    @Param('sessionId') sessionId: string,
    @Param('gsic') gsic: string,
    @Body() updateCartDto: UpdateCartDto,
  ) {
    return this.cartService.update(sessionId, gsic, updateCartDto);
  }
}
