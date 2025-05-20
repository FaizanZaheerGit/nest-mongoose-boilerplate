import { BaseModel } from '@database/models/base.model';
import { PermissionEnums } from '@enums/permissions.enum';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type RoleDocument = HydratedDocument<Role>;

@Schema({
  versionKey: false,
  timestamps: true,
})
export class Role extends BaseModel {
  @Prop({ type: String, required: true, unique: true })
  title: string;

  @Prop({ type: [String], default: [] })
  rights: PermissionEnums[];
}

export const RoleSchema = SchemaFactory.createForClass(Role);
