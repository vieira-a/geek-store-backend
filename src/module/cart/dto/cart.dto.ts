import { Expose } from 'class-transformer';

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
  items: CartDtoItems[];

  @Expose()
  totalItems: number;

  @Expose()
  totalPrice: number;
}
