import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { ProductService } from '../service/product.service';
import { ProductDto } from '../dto/product.dto';
import { ProductException } from '../exception/product.exception';
import { CreateProductDto } from '../dto/create-product.dto';
import { PageOptionsDto } from 'src/module/shared/pagination/dto/page-options.dto';
import { Response } from 'express';
import { UpdateProductDto } from '../dto/update-product.dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  async createProduct(@Body() product: CreateProductDto): Promise<ProductDto> {
    return this.productService.create(product);
  }

  @Get()
  async findAllProducts(
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<ProductDto[] | null> {
    const product = await this.productService.findAll(pageOptionsDto);
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

  @Delete(':slug/:gsic')
  async deleteProduct(
    @Param('slug') slug: string,
    @Param('gsic') gsic: string,
    @Res() res: Response,
  ) {
    const result = await this.productService.delete(slug, gsic);

    if (result.deletedCount === 0) {
      throw new ProductException(
        'Exclusão não processada',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    return res.status(HttpStatus.NO_CONTENT).send();
  }

  @Patch(':slug/:gsic')
  async updateProduct(
    @Param('slug') slug: string,
    @Param('gsic') gsic: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    const product = await this.productService.update(
      slug,
      gsic,
      updateProductDto,
    );

    if (product) {
      return product;
    }
  }
}
