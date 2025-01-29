import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsString, ValidateNested } from 'class-validator';

export class CreateCartItemDto {
  @IsString()
  slug: string;

  @IsString()
  gsic: string;

  @IsNumber()
  quantity: number;
}

export class CreateCartDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateCartItemDto)
  items: CreateCartItemDto[];
}
