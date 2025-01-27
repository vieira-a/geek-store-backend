export class UpdateCartItemDto {
  gsic: string;
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export class UpdateCartDto {
  items: UpdateCartItemDto[];
}
