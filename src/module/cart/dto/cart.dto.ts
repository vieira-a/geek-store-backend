import { Expose } from 'class-transformer';
import { CartStatus } from '../constant/cart-status';

export class CartDtoItems {
  gsic: string;
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
}
export class CartDto {
  @Expose()
  sessionId: string;

  @Expose()
  gsic: string;

  @Expose()
  items: CartDtoItems[];

  @Expose()
  totalItems: number;

  @Expose()
  totalPrice: number;

  @Expose()
  status: string;
}
