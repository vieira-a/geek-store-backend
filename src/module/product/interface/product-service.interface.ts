import { PageOptionsDto } from 'src/module/shared/pagination/dto/page-options.dto';
import { CreateProductDto } from '../dto/create-product.dto';
import { ProductDto } from '../dto/product.dto';
import { PageDto } from 'src/module/shared/pagination/dto/page.dto';
import { DeleteResult } from 'mongoose';
import { UpdateProductDto } from '../dto/update-product.dto';

export interface ProductServiceInterface {
  create(product: CreateProductDto): Promise<ProductDto>;
  findAll(pageOptionsDto: PageOptionsDto): Promise<PageDto<ProductDto>>;
  findBySlugAndInternalCode(
    slug: string,
    gsic: string,
  ): Promise<ProductDto | null>;
  delete(slug: string, gsic: string): Promise<DeleteResult | null>;
  update(
    slug: string,
    gsic: string,
    updataProductDto: UpdateProductDto,
  ): Promise<ProductDto>;
}
