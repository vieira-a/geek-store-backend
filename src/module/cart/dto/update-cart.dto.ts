export class UpdateCartItemDto {
  slug: string;
  gsic: string;
  quantity: number;
}

export class UpdateCartDto {
  items: UpdateCartItemDto[];
}
