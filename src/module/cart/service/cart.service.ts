import {
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cart } from '../schema/cart.schema';
import { Model } from 'mongoose';
import { ProductServiceInterface } from 'src/module/product/interface/product-service.interface';
import { CreateCartDto } from '../dto/create-cart.dto';
import { v4 as uuidv4 } from 'uuid';
import { CartDto } from '../dto/cart.dto';
import { CartException } from '../exception/cart.exception';
@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private cartModel: Model<Cart>,
    @Inject('ProductService')
    private readonly productService: ProductServiceInterface,
  ) {}

  async create(createCartDto: CreateCartDto): Promise<CartDto> {
    const cartItems = createCartDto.items;

    const items: {
      gsic: string;
      name: string;
      price: number;
      quantity: number;
      subtotal: number;
    }[] = [];
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

    const cart = await this.cartModel.create({
      sessionId: uuidv4(),
      items,
      totalItems,
      totalPrice,
    });

    const createdCart = await cart.save();

    return {
      sessionId: createdCart.sessionId,
      items: createdCart.items.map((item) => {
        return {
          gsic: item.gsic,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          subtotal: item.subtotal,
        };
      }),
      totalItems: createdCart.totalItems,
      totalPrice: createdCart.totalPrice,
    };
  }
}
