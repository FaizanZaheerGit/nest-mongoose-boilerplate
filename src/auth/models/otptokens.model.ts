import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';
import { User } from '@user/models/users.model';

export type OtpTokenDocument = HydratedDocument<OtpToken>;

@Schema({
  versionKey: false,
  timestamps: true,
})
export class OtpToken {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'User', required: true })
  user: User;

  @Prop({ type: String, required: true })
  token: string;

  @Prop({ type: Number, default: () => new Date(Date.now() + 60 * 60 * 1000), expires: 3600 })
  expiresAt: number;

  @Prop({ type: Boolean, default: false })
  isExpired: boolean;
}

export const OtpTokenSchema = SchemaFactory.createForClass(OtpToken);
