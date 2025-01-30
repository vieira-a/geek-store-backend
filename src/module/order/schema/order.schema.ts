import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { CartItem } from 'src/module/cart/schema/cart.schema';

@Schema({ timestamps: true })
export class Order {
  @Prop({ required: true, type: String })
  gsic: string;

  @Prop({ required: true, type: String })
  cartId: string;

  @Prop({ required: true, type: String })
  customerId: string;

  @Prop({ required: true, type: [CartItem] })
  items: CartItem[];

  @Prop({ required: true, type: Number, default: 0 })
  totalItems: number;

  @Prop({ required: true, type: Number, default: 0 })
  totalPrice: number;

  @Prop({
    required: true,
    enum: ['pending', 'confirmed', 'shipped', 'delivered, canceled'],
    default: 'pending',
  })
  status: string;

  @Prop({ type: Date })
  deliveryDate: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
