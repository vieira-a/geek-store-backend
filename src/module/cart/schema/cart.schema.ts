import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export class CartItem {
  @Prop()
  gsic: string;

  @Prop()
  name: string;

  @Prop()
  price: number;

  @Prop()
  quantity: number;

  @Prop()
  subtotal: number;

  @Prop()
  imageUrl: string;
}
@Schema({ timestamps: true })
export class Cart extends Document {
  @Prop({ required: true, type: String })
  sessionId: string;

  @Prop({ required: true, type: String })
  gsic: string;

  @Prop({ type: [CartItem] })
  items: CartItem[];

  @Prop({ required: true, type: Number, default: 0 })
  totalItems: number;

  @Prop({ required: true, type: Number, default: 0 })
  totalPrice: number;

  @Prop({
    required: true,
    enum: ['active', 'abandoned', 'completed'],
    default: 'active',
  })
  status: string;
}

export const CartSchema = SchemaFactory.createForClass(Cart);
