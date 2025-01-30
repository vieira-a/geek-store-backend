import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';

export class CartDtoItems {
  @ApiProperty({
    name: 'gsic',
    description: 'Código interno do produto no carrinho',
  })
  gsic: string;

  @ApiProperty({ name: 'slug', description: 'Slug do produto' })
  slug: string;

  @ApiProperty({ name: 'name', description: 'Nome do produto' })
  name: string;

  @ApiProperty({ name: 'price', description: 'Preço do produto' })
  @Transform(({ value }) => Number(value).toFixed(2))
  price: number;
  quantity: number;

  @ApiProperty({ name: 'subtotal', description: 'Subtotal do produto' })
  @Transform(({ value }) => Number(value).toFixed(2))
  subtotal: number;

  @ApiProperty({ name: 'imageUrl', description: 'URL da imagem do produto' })
  imageUrl: string;
}
export class CartDto {
  @ApiProperty({ name: 'sessionId', description: 'ID da sessão do carrinho' })
  @Expose()
  sessionId: string;

  @ApiProperty({
    name: 'gsic',
    description: 'Código interno do produto no carrinho',
  })
  @Expose()
  gsic: string;

  @ApiProperty({ name: 'items', description: 'Itens do carrinho' })
  @Expose()
  items: CartDtoItems[];

  @ApiProperty({
    name: 'totalItems',
    description: 'Total de itens no carrinho',
  })
  @Expose()
  totalItems: number;

  @ApiProperty({ name: 'totalPrice', description: 'Preço total do carrinho' })
  @Expose()
  @Transform(({ value }) => Number(value).toFixed(2))
  totalPrice: number;

  @ApiProperty({ name: 'status', description: 'Status do carrinho' })
  @Expose()
  status: string;
}
