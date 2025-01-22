import { Body, Controller, Post } from '@nestjs/common';
import { ProductService } from '../service/product.service';
import { Product } from '../schema/product.schema';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  async createProduct(@Body() product: Product): Promise<Product> {
    return this.productService.create(product);
  }
}
