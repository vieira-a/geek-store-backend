import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './schema/product.schema';
import { ProductService } from './service/product.service';
import { ProductController } from './controller/product.controller';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
  ],
  providers: [
    ProductService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
    {
      provide: 'ProductService',
      useClass: ProductService,
    },
  ],
  controllers: [ProductController],
  exports: ['ProductService'],
})
export class ProductModule {}
