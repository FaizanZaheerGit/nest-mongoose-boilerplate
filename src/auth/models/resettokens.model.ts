import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';
import { User } from '@user/models/users.model';

export type ResetTokenDocument = HydratedDocument<ResetToken>;

@Schema({
  versionKey: false,
  timestamps: true,
})
export class ResetToken {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'User', required: true })
  user: User;

  @Prop({ type: String, required: true })
  token: string;

  @Prop({ type: Number, default: new Date(Date.now() + 24 * 60 * 60 * 1000) })
  expiresAt: number;

  @Prop({ type: Boolean, default: false })
  isExpired: boolean;
}

export const ResetTokenSchema = SchemaFactory.createForClass(ResetToken);
