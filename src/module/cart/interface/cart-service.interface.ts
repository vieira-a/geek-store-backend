import { CartDto, CartDtoItems } from '../dto/cart.dto';
import { CreateCartDto } from '../dto/create-cart.dto';
import { UpdateCartDto } from '../dto/update-cart.dto';
import { Cart } from '../schema/cart.schema';

export interface CartServiceInterface {
  create(createCartDto: CreateCartDto): Promise<CartDto>;
  update(
    sessionId: string,
    gsic: string,
    updateCartDto: UpdateCartDto,
  ): Promise<CartDto>;
  findByGsic(gsic: string): Promise<Cart | null>;
  recalculateCartItems(items: CartDtoItems[]): Promise<CartDtoItems[]>;
}
