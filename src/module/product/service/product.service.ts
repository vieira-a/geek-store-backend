import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from '../schema/product.schema';
import { DeleteResult, Model } from 'mongoose';
import { ProductDto } from '../dto/product.dto';
import { plainToInstance } from 'class-transformer';
import { CreateProductDto } from '../dto/create-product.dto';
import { generateSlug } from 'src/module/shared/helper/generate-slug.helper';
import { generateInternalCode } from 'src/module/shared/helper/generate-internal-code.helper';
import { PageOptionsDto } from 'src/module/shared/pagination/dto/page-options.dto';
import { PageDto } from 'src/module/shared/pagination/dto/page.dto';
import { PageMetaDto } from 'src/module/shared/pagination/dto/page-meta.dto';
import { ProductException } from '../exception/product.exception';
@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  async create(product: CreateProductDto): Promise<ProductDto> {
    let generatedSlug = generateSlug(product.name);
    let generatedInternalCode = generateInternalCode('PRT');

    let productExists = await this.findBySlugAndInternalCode(
      generatedSlug,
      generatedInternalCode,
    );

    while (productExists) {
      generatedSlug = generateSlug(product.name);
      generatedInternalCode = generateInternalCode('PRT');

      productExists = await this.findBySlugAndInternalCode(
        generatedSlug,
        generatedInternalCode,
      );
    }

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

  async findAll(
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<ProductDto> | any> {
    const query = await this.productModel
      .find()
      .sort({ createdAt: pageOptionsDto.order ?? 'desc' })
      .skip(pageOptionsDto.skip)
      .limit(pageOptionsDto.take ?? 10);

    const itemCount = await this.productModel.countDocuments();
    const products = query;

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
    return new PageDto(
      plainToInstance(ProductDto, products, { excludeExtraneousValues: true }),
      pageMetaDto,
    );
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

  async delete(slug: string, gsic: string): Promise<DeleteResult> {
    const product = await this.productModel.findOne({ slug, gsic });

    if (!product) {
      throw new ProductException('Product not found', HttpStatus.NOT_FOUND);
    }

    return await this.productModel.deleteOne({ _id: product._id });
  }
}
