import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { CartItem } from 'src/module/cart/schema/cart.schema';

@Schema({ timestamps: true })
export class CustomerCart {
  @Prop({ required: true, type: String })
  gsic: string;

  @Prop({ required: true, type: String })
  customerId: string;

  @Prop({ required: true, type: String })
  cartId: string;

  @Prop({ required: true, type: [CartItem] })
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

export const CustomerCartSchema = SchemaFactory.createForClass(CustomerCart);
CustomerCartSchema.index({ customerId: 1, cartId: 1 }, { unique: true });
