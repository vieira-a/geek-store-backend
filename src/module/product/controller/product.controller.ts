import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ProductService } from '../service/product.service';
import { Product } from '../schema/product.schema';
import { ProductDto } from '../dto/product.dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  async createProduct(@Body() product: Product): Promise<Product> {
    return this.productService.create(product);
  }

  @Get()
  async findAllProducts(): Promise<ProductDto[] | null> {
    return await this.productService.findAll();
  }

  @Get(':slug/:gsic')
  async findProductBySlugAndGsic(
    @Param('slug') slug: string,
    @Param('gsic') gsic: string,
  ): Promise<ProductDto | null> {
    return this.productService.findBySlugAndInternalCode(slug, gsic);
  }
}
