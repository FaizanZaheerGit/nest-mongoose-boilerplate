import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Role } from '@role/models/roles.model';
import { BaseModel } from '@src/database/models/base.model';
import { UserTypeEnums } from '@src/utils/enums/userType.enums';
import { HydratedDocument, SchemaTypes } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({
  versionKey: false,
  timestamps: true,
})
export class User extends BaseModel {
  @Prop({ type: String, required: true, unique: true, lowercase: true })
  email: string;

  @Prop({ type: String, default: '' })
  name: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({ type: String, enum: UserTypeEnums, default: UserTypeEnums.USER })
  userType: UserTypeEnums;

  @Prop({ type: [SchemaTypes.ObjectId], ref: 'Role', default: [] })
  roles: Role[];
}

export const UserSchema = SchemaFactory.createForClass(User);
