import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from '../schema/product.schema';
import { Model } from 'mongoose';
import { ProductDto } from '../dto/product.dto';
import { plainToInstance } from 'class-transformer';
import { CreateProductDto } from '../dto/create-product.dto';
import { generateSlug } from 'src/module/shared/helper/generate-slug.helper';
import { generateInternalCode } from 'src/module/shared/helper/generate-internal-code.helper';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  async create(product: CreateProductDto): Promise<ProductDto> {
    const generatedSlug = generateSlug(product.name);
    const generatedInternalCode = generateInternalCode('PRT');

    const productData = {
      ...product,
      slug: generatedSlug,
      gsic: generatedInternalCode,
    };

    const createdProduct = new this.productModel(productData);
    const savedProduct = await createdProduct.save();

    return plainToInstance(ProductDto, savedProduct, {
      excludeExtraneousValues: true,
    });
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
