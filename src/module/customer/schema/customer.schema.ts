import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Customer extends Document {
  @Prop({ required: true, type: String })
  gsic: string;

  @Prop({ required: true, type: String })
  name: string;

  @Prop({ required: true, type: String, unique: true })
  email: string;

  @Prop({ required: false, type: String })
  phone: string;

  @Prop({ required: true, type: String })
  password: string;

  @Prop({
    required: true,
    enum: ['active', 'inactive', 'blocked'],
    default: 'active',
  })
  status: string;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);
