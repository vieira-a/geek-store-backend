import { CartDto, CartDtoItems } from '../dto/cart.dto';
import { Cart } from '../schema/cart.schema';

export const mapCreateCartDtoToCart = (cart: Cart): CartDto => {
  const items: CartDtoItems[] = cart.items.map((item) => {
    return {
      gsic: item.gsic,
      slug: item.slug,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      subtotal: item.subtotal,
      imageUrl: item.imageUrl,
    };
  });

  return {
    sessionId: cart.sessionId,
    gsic: cart.gsic,
    items,
    totalItems: cart.totalItems,
    totalPrice: cart.totalPrice,
    status: cart.status,
  };
};
