import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsPositive, Min } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    description: 'Nome do produto',
    example: 'Camiseta',
  })
  @IsNotEmpty({ message: 'Um nome deve ser informado para o produto ' })
  name: string;

  @ApiProperty({
    description: 'Descrição do produto',
    example: 'Camiseta de algodão',
  })
  @IsNotEmpty({ message: 'Uma descrição deve ser informada para o produto ' })
  description: string;

  @ApiProperty({
    description: 'Preço do produto',
    example: 50.0,
  })
  @IsNotEmpty({ message: 'Um preço deve ser informado para o produto ' })
  price: number;

  @ApiProperty({
    description: 'Quantidade do produto em estoque',
    example: 10,
  })
  @IsPositive({
    message: 'A quantidade do produto em estoque deve ser positivo ',
  })
  @IsInt({
    message: 'A quantidade do produto em estoque deve ser um número inteiro ',
  })
  @Min(0, {
    message: 'A quantidade do produto em estoque deve ser no mínimo 0 ',
  })
  @IsNotEmpty({
    message: 'A quantidade do produto em estoque deve ser informada ',
  })
  stock: number;

  @ApiProperty({
    description: 'Categoria do produto',
    example: 'Roupas',
  })
  @IsNotEmpty({ message: 'Uma categoria deve ser informada para o produto ' })
  category: string;

  @ApiProperty({
    description: 'URL da imagem do produto',
    example: 'https://example.com/image.jpg',
  })
  @IsNotEmpty({
    message: 'Uma URL deve ser informada para a imagem do produto ',
  })
  imageUrl: string;
}
