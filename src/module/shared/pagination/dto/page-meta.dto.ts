import { ApiProperty } from '@nestjs/swagger';
import { PageMetaDtoParameters } from '../interface/page-meta-params.interface';

export class PageMetaDto {
  @ApiProperty({ type: Number, example: 1 })
  readonly page: number;

  @ApiProperty({ type: Number, example: 10 })
  readonly take: number;

  @ApiProperty({ type: Number, example: 10 })
  readonly itemCount: number;

  @ApiProperty({ type: Number, example: 1 })
  readonly pageCount: number;

  @ApiProperty({ type: Boolean, example: true })
  readonly hasPreviousPage: boolean;

  @ApiProperty({ type: Boolean, example: true })
  readonly hasNextPage: boolean;

  constructor({ pageOptionsDto, itemCount }: PageMetaDtoParameters) {
    this.page = pageOptionsDto.page ?? 1;
    this.take = pageOptionsDto.take ?? 10;
    this.itemCount = itemCount;
    this.pageCount = Math.ceil(this.itemCount / this.take);
    this.hasPreviousPage = this.page > 1;
    this.hasNextPage = this.page < this.pageCount;
  }
}
