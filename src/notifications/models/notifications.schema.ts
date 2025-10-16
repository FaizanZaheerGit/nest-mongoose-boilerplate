import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseModel } from '@database/models/base.model';
import { HydratedDocument, SchemaTypes } from 'mongoose';
import { User } from '@user/models/users.model';
import {
  NotificationCategories,
  NotificationChannels,
} from '@notifications/enums/notifications.enum';

export type NotificationDocument = HydratedDocument<Notification>;

@Schema({
  versionKey: false,
  timestamps: true,
})
export class Notification extends BaseModel {
  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String, required: true })
  body: string;

  @Prop({ type: SchemaTypes.ObjectId, required: true, ref: 'User', index: true })
  user: User;

  @Prop({ type: String, default: null })
  redirectUrl: string;

  @Prop({ type: Boolean, default: false, index: true })
  seen: boolean;

  @Prop({ type: Date, default: null })
  seenTime: Date;

  @Prop({ type: Boolean, default: false, index: true })
  dismissed: boolean;

  @Prop({ type: Date, default: null })
  dismissedTime: Date;

  @Prop({
    type: String,
    enum: NotificationCategories,
    default: NotificationCategories.SYSTEM,
    index: true,
  })
  category: NotificationCategories;

  @Prop({ type: String, enum: NotificationChannels, default: NotificationChannels.PUSH })
  channel: NotificationChannels;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
