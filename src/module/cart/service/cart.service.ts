import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cart } from '../schema/cart.schema';
import { Model } from 'mongoose';
import { ProductServiceInterface } from 'src/module/product/interface/product-service.interface';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private cartModel: Model<Cart>,
    @Inject('ProductService')
    private readonly productService: ProductServiceInterface,
  ) {}
}
