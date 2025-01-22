import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Product extends Document {
  @Prop({ required: true, type: String })
  name: string;

  @Prop({ required: true, type: String })
  description: string;

  @Prop({ required: true, type: String })
  slug: string;

  @Prop({ required: true, type: String })
  gsic: string;

  @Prop({ required: true, type: Number })
  price: number;

  @Prop({ required: true, type: Number })
  stock: number;

  @Prop({ required: true, type: String })
  category: string;

  @Prop({ required: false, type: String })
  imageUrl: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
