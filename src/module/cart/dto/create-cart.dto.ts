export class CreateCartItemDto {
  slug: string;
  gsic: string;
  quantity: number;
  subtotal: number;
}

export class CreateCartDto {
  items: CreateCartItemDto[];
}
