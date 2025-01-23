import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { CartService } from '../service/cart.service';
import { CreateCartDto } from '../dto/create-cart.dto';

@Controller('carts')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createCart(@Body() createCartDto: CreateCartDto) {
    return this.cartService.create(createCartDto);
  }
}
