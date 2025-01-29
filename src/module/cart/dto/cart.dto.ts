import { Expose, Transform } from 'class-transformer';

export class CartDtoItems {
  gsic: string;
  name: string;

  @Transform(({ value }) => Number(value).toFixed(2))
  price: number;
  quantity: number;

  @Transform(({ value }) => Number(value).toFixed(2))
  subtotal: number;

  imageUrl: string;
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
  @Transform(({ value }) => Number(value).toFixed(2))
  totalPrice: number;

  @Expose()
  status: string;
}
