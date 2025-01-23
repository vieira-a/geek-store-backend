import { Expose } from 'class-transformer';

export class CartDto {
  @Expose()
  sessionId: string;

  @Expose()
  items: Array<{
    gsic: string;
    name: string;
    price: number;
    quantity: number;
    subtotal: number;
  }>;

  @Expose()
  totalItems: number;

  @Expose()
  totalPrice: number;
}
