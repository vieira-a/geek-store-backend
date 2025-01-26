import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cart, CartItem } from '../schema/cart.schema';
import { Model } from 'mongoose';
import { ProductServiceInterface } from '../../../module/product/interface/product-service.interface';
import { CreateCartDto } from '../dto/create-cart.dto';
import { v4 as uuidv4 } from 'uuid';
import { CartDto, CartDtoItems } from '../dto/cart.dto';
import { CartException } from '../exception/cart.exception';
import { mapCreateCartDtoToCart } from '../helper/create-cart-dto-to-cart.mapper';
import { generateInternalCode } from '../../../module/shared/helper/generate-internal-code.helper';
import { UpdateCartDto } from '../dto/update-cart.dto';
import { CustomerCart } from 'src/module/customer/schema/customer-cart.schema';
import { CartServiceInterface } from '../interface/cart-service.interface';

@Injectable()
export class CartService implements CartServiceInterface {
  constructor(
    @InjectModel(Cart.name) private cartModel: Model<Cart>,
    @Inject('ProductService')
    private readonly productService: ProductServiceInterface,
  ) {}

  async create(createCartDto: CreateCartDto): Promise<CartDto> {
    const cartItems = createCartDto.items;

    const items: CartDtoItems[] = [];

    let totalItems = 0;
    let totalPrice = 0;

    for (const cartItem of cartItems) {
      const product = await this.productService.findBySlugAndInternalCode(
        cartItem.slug,
        cartItem.gsic,
      );

      if (!product) {
        throw new CartException(`Produto não encontrado`, HttpStatus.NOT_FOUND);
      }

      if (product.stock < cartItem.quantity) {
        throw new CartException(
          `Produto ${product.name} sem estoque suficiente`,
          HttpStatus.BAD_REQUEST,
        );
      }

      const itemTotalPrice = cartItem.quantity * product.price;

      items.push({
        gsic: product.gsic,
        name: product.name,
        price: product.price,
        quantity: cartItem.quantity,
        subtotal: cartItem.quantity * product.price,
      });

      totalItems += cartItem.quantity;
      totalPrice += itemTotalPrice;
    }

    const cartGsic = generateInternalCode('CAT');
    const cart = await this.cartModel.create({
      sessionId: uuidv4(),
      gsic: cartGsic,
      items,
      totalItems,
      totalPrice,
      status: 'active',
    });

    const createdCart = await cart.save();

    return mapCreateCartDtoToCart(createdCart);
  }

  async update(
    sessionId: string,
    gsic: string,
    updateCartDto: UpdateCartDto,
  ): Promise<CartDto> {
    const cart = await this.cartModel.findOne({ sessionId, gsic });

    if (!cart) {
      throw new CartException('Carrinho não encontrado', HttpStatus.NOT_FOUND);
    }

    const updateItems = updateCartDto.items;

    const recalculatedItems = await this.recalculateCartItems(updateItems);

    cart.items = recalculatedItems;

    cart.totalItems = recalculatedItems.reduce(
      (acc, item) => acc + item.quantity,
      0,
    );
    cart.totalPrice = recalculatedItems.reduce(
      (acc, item) => acc + item.subtotal,
      0,
    );

    const updatedCart = await cart.save();
    return mapCreateCartDtoToCart(updatedCart);
  }

  findByGsic(gsic: string): Promise<Cart | null> {
    return this.cartModel.findOne({ gsic }).exec();
  }

  async recalculateCartItems(items: CartDtoItems[]): Promise<CartDtoItems[]> {
    const updatedItems: CartDtoItems[] = [];

    for (const item of items) {
      const product = await this.productService.findByGsic(item.gsic);

      if (!product) {
        throw new Error(`Produto com GSIC ${item.gsic} não encontrado`);
      }

      if (product.stock < item.quantity) {
        throw new CartException(
          `Produto ${product.name} sem estoque suficiente`,
          HttpStatus.BAD_REQUEST,
        );
      }

      const updatedItem = {
        ...item,
        price: product.price,
        subtotal: product.price * item.quantity,
      };

      updatedItems.push(updatedItem);
    }

    return updatedItems;
  }

  async finishCart(cartId: string): Promise<void> {
    await this.cartModel.updateOne({ _id: cartId }, { status: 'completed' });
  }
}
