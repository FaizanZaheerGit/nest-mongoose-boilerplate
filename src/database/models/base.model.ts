import { Prop, Schema } from '@nestjs/mongoose';
import { StatusEnums } from '@utils/enums/status.enums';
import { HydratedDocument, Types } from 'mongoose';

export type BaseDocument = HydratedDocument<BaseModel>;

@Schema({
  timestamps: true,
  versionKey: false,
})
export class BaseModel {
  _id?: Types.ObjectId; // NOTE: This has been added to avoid typescript errors when accessing _id from models

  @Prop({ type: String, default: StatusEnums.ACTIVE })
  status: string;
}
