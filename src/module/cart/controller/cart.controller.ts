import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CartService } from '../service/cart.service';
import { CreateCartDto } from '../dto/create-cart.dto';
import { UpdateCartDto } from '../dto/update-cart.dto';

@Controller('carts')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createCart(@Body() createCartDto: CreateCartDto) {
    return this.cartService.create(createCartDto);
  }

  @Patch(':sessionId/:gsic')
  @HttpCode(HttpStatus.OK)
  async updateCart(
    @Param('sessionId') sessionId: string,
    @Param('gsic') gsic: string,
    @Body() updateCartDto: UpdateCartDto,
  ) {
    return this.cartService.update(sessionId, gsic, updateCartDto);
  }
}
