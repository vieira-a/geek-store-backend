import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from '../schema/product.schema';
import { Model } from 'mongoose';
import { ProductDto } from '../dto/product.dto';
import { plainToClass, plainToInstance } from 'class-transformer';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  async create(product: Product): Promise<Product> {
    const createdProduct = new this.productModel(product);
    return createdProduct.save();
  }

  async findAll(): Promise<ProductDto[] | null> {
    const products = await this.productModel.find();
    return plainToInstance(ProductDto, products, {
      excludeExtraneousValues: true,
    });
  }

  async findBySlugAndInternalCode(
    slug: string,
    gsic: string,
  ): Promise<ProductDto | null> {
    const product = await this.productModel.findOne({ slug, gsic });
    return plainToInstance(ProductDto, product, {
      excludeExtraneousValues: true,
    });
  }
}
