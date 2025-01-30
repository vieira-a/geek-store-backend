import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class UpdateCartItemDto {
  @ApiProperty({ name: 'slug', description: 'Slug do produto' })
  @IsOptional()
  @IsString()
  slug: string;

  @ApiProperty({
    name: 'gsic',
    description: 'Código interno do produto no carrinho',
  })
  @IsString()
  gsic: string;

  @ApiProperty({ name: 'name', description: 'Nome do produto' })
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty({ name: 'price', description: 'Preço do produto' })
  @IsOptional()
  @IsNumber()
  price: number;

  @ApiProperty({ name: 'quantity', description: 'Quantidade do produto' })
  @IsNumber()
  quantity: number;

  @ApiProperty({ name: 'subtotal', description: 'Subtotal do produto' })
  @IsOptional()
  @IsNumber()
  subtotal: number;
}
export class UpdateCartDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateCartItemDto)
  items: UpdateCartItemDto[];
}
