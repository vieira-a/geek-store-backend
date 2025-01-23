import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';

class CartItem {
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
}
@Schema({ timestamps: true })
export class Cart extends Document {
  @Prop({ required: true, type: String })
  sessionId: string;

  @Prop({ type: [CartItem] })
  items: CartItem[];

  @Prop({ required: true, type: Number, default: 0 })
  totalItems: number;

  @Prop({ required: true, type: Number, default: 0 })
  totalPrice: number;
}

export const CartSchema = SchemaFactory.createForClass(Cart);
