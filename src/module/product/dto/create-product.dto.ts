import {
  IsInt,
  IsNotEmpty,
  IsPositive,
  IsUrl,
  isURL,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty({ message: 'Um nome deve ser informado para o produto ' })
  name: string;

  @IsNotEmpty({ message: 'Uma descrição deve ser informada para o produto ' })
  description: string;

  @IsNotEmpty({ message: 'Um preço deve ser informado para o produto ' })
  price: number;

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

  @IsNotEmpty({ message: 'Uma categoria deve ser informada para o produto ' })
  category: string;

  @IsNotEmpty({
    message: 'Uma URL deve ser informada para a imagem do produto ',
  })
  imageUrl: string;
}
