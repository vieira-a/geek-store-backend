import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsString, ValidateNested } from 'class-validator';

export class CreateCartItemDto {
  @ApiProperty({
    description: 'Slug do produto',
    example: 'camiseta-star-wars',
  })
  @IsString()
  slug: string;

  @ApiProperty({
    description: 'Código interno do produto no carrinho (GSIC)',
    example: 'GSIC12345',
  })
  @IsString()
  gsic: string;

  @ApiProperty({
    description: 'Quantidade do produto',
    example: 2,
  })
  @IsNumber()
  quantity: number;
}

export class CreateCartDto {
  @ApiProperty({
    description: 'Lista de itens no carrinho',
    type: [CreateCartItemDto],
    example: [
      {
        slug: 'camiseta-star-wars',
        gsic: 'GSIC12345',
        quantity: 2,
      },
      {
        slug: 'bone-harry-potter',
        gsic: 'GSIC67890',
        quantity: 1,
      },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateCartItemDto)
  items: CreateCartItemDto[];
}
