import { Type } from 'class-transformer';
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class UpdateCartItemDto {
  @IsString()
  gsic: string;

  @IsOptional()
  @IsString()
  name: string;

  @IsNumber()
  @IsOptional()
  price: number;

  @IsNumber()
  quantity: number;

  @IsNumber()
  @IsOptional()
  subtotal: number;
}

export class UpdateCartDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateCartItemDto)
  items: UpdateCartItemDto[];
}
