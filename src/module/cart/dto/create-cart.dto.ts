export class CreateCartItemDto {
  slug: string;
  gsic: string;
  quantity: number;
}

export class CreateCartDto {
  items: CreateCartItemDto[];
}
