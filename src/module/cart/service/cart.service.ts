import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cart } from '../schema/cart.schema';
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

    const cartItems = updateCartDto.items;

    for (const item of cartItems) {
      const product = await this.productService.findBySlugAndInternalCode(
        item.slug,
        item.gsic,
      );

      if (!product) {
        throw new CartException(
          `Produto ${item.slug} não encontrado`,
          HttpStatus.NOT_FOUND,
        );
      }

      if (product.stock < item.quantity) {
        throw new CartException(
          `Produto ${product.name} sem estoque suficiente`,
          HttpStatus.BAD_REQUEST,
        );
      }

      const cartItem = cart.items.find((i) => i.gsic === item.gsic);

      if (cartItem) {
        if (item.quantity <= 0) {
          cart.items = cart.items.filter((i) => i.gsic !== item.gsic);
        } else {
          cartItem.quantity = item.quantity;
          cartItem.subtotal = item.quantity * cartItem.price;
        }
      } else if (item.quantity > 0) {
        cart.items.push({
          gsic: product.gsic,
          name: product.name,
          price: product.price,
          quantity: item.quantity,
          subtotal: item.quantity * product.price,
        });
      }
    }

    cart.items = cart.items.filter((cartItem) =>
      cartItems.some((item) => item.gsic === cartItem.gsic),
    );

    const totalItems = cart.items.reduce((acc, item) => acc + item.quantity, 0);
    const totalPrice = cart.items.reduce((acc, item) => acc + item.subtotal, 0);

    cart.totalItems = totalItems;
    cart.totalPrice = totalPrice;

    const updatedCart = await cart.save();
    return mapCreateCartDtoToCart(updatedCart);
  }

  findByGsic(gsic: string): Promise<Cart | null> {
    return this.cartModel.findOne({ gsic }).exec();
  }
}
