import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto {
  @ApiProperty({ name: 'cartGsic', description: 'Código interno do carrinho' })
  cartGsic: string;

  @ApiProperty({
    name: 'customerGsic',
    description: 'Código interno do cliente',
  })
  customerGsic: string;
}
