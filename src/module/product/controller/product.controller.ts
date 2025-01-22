import { Body, Controller, Get, HttpStatus, Param, Post } from '@nestjs/common';
import { ProductService } from '../service/product.service';
import { Product } from '../schema/product.schema';
import { ProductDto } from '../dto/product.dto';
import { ProductException } from '../exception/product.exception';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  async createProduct(@Body() product: Product): Promise<Product> {
    return this.productService.create(product);
  }

  @Get()
  async findAllProducts(): Promise<ProductDto[] | null> {
    const product = await this.productService.findAll();
    if (!product || product.length === 0) {
      throw new ProductException('No products found', HttpStatus.NO_CONTENT);
    }

    return product;
  }

  @Get(':slug/:gsic')
  async findProductBySlugAndGsic(
    @Param('slug') slug: string,
    @Param('gsic') gsic: string,
  ): Promise<ProductDto | null> {
    const product = await this.productService.findBySlugAndInternalCode(
      slug,
      gsic,
    );

    if (!product) {
      throw new ProductException('Product not found', HttpStatus.NOT_FOUND);
    }

    return product;
  }
}
