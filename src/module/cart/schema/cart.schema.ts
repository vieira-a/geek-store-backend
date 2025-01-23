import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: true })
export class Cart {
  @Prop({ required: true, type: String })
  sessionId: string;

  @Prop({
    required: true,
    type: [
      {
        gsic: { type: String, required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
      },
    ],
  })
  items: Array<{
    gsic: string;
    name: string;
    price: number;
    quantity: number;
  }>[];

  @Prop({ required: true, type: Number, default: 0 })
  totalItems: number;

  @Prop({ required: true, type: Number, default: 0 })
  totalPrice: number;
}

export const CartSchema = SchemaFactory.createForClass(Cart);
