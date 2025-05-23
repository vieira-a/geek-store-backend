import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ProductService } from '../service/product.service';
import { ProductDto } from '../dto/product.dto';
import { ProductException } from '../exception/product.exception';
import { CreateProductDto } from '../dto/create-product.dto';
import { PageOptionsDto } from 'src/module/shared/pagination/dto/page-options.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { PageDto } from 'src/module/shared/pagination/dto/page.dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Criar um novo produto' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Produto criado com sucesso',
    type: ProductDto,
  })
  async createProduct(@Body() product: CreateProductDto): Promise<ProductDto> {
    return this.productService.create(product);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Listar todos os produtos' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de produtos',
    type: PageDto,
  })
  async findAllProducts(
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<ProductDto>> {
    const product = await this.productService.findAll(pageOptionsDto);
    if (!product || product.data.length === 0) {
      throw new ProductException('No products found', HttpStatus.NO_CONTENT);
    }

    return product;
  }

  @Get(':slug/:gsic')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Buscar produto por slug e gsic' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Produto encontrado',
    type: ProductDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Produto não encontrado',
  })
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
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Excluir um produto' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Produto excluído com sucesso',
  })
  async deleteProduct(
    @Param('slug') slug: string,
    @Param('gsic') gsic: string,
  ) {
    const result = await this.productService.delete(slug, gsic);

    if (!result || result.deletedCount === 0) {
      throw new ProductException(
        'Exclusão não processada',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    return result;
  }

  @Patch(':slug/:gsic')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Atualizar produto' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Produto atualizado',
    type: ProductDto,
  })
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
