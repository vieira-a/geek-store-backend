import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ProductService } from '../service/product.service';
import { Product } from '../schema/product.schema';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  async createProduct(@Body() product: Product): Promise<Product> {
    return this.productService.create(product);
  }

  @Get()
  async findAllProducts(
    @Param() slug: string,
    gsic: string,
  ): Promise<Product[] | null> {
    return this.productService.findAll();
  }

  @Get(':slug/:gsic')
  async findProductBySlugAndGsic(
    @Param('slug') slug: string,
    @Param('gsic') gsic: string,
  ): Promise<Product | null> {
    return this.productService.findBySlugAndInternalCode(slug, gsic);
  }
}
