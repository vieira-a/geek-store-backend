import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Customer {
  @Prop({ required: true, type: String })
  gsic: string;

  @Prop({ required: true, type: String })
  name: string;

  @Prop({ required: true, type: String })
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
