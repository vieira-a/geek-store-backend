import { Expose } from 'class-transformer';

export class ProductDto {
  @Expose()
  name: string;

  @Expose()
  description: string;

  @Expose()
  slug: string;

  @Expose()
  gsic: string;

  @Expose()
  price: number;

  @Expose()
  stock: number;

  @Expose()
  category: string;

  @Expose()
  imageUrl: string;
}
