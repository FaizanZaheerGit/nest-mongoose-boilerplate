import { PermissionEnums } from '@enums/permissions.enum';
import { StatusEnums } from '@enums/status.enums';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';

export class UpdateRoleDto {
  @ApiProperty({
    title: 'Title',
    name: 'title',
    description: 'This is the title of a role',
    example: 'First Role',
    required: true,
    type: String,
  })
  @IsString({ message: 'title must be a string' })
  @IsOptional()
  title?: string;

  @ApiProperty({
    title: 'Rights',
    name: 'rights',
    description: 'This is the array of rights for a role',
    example: [PermissionEnums.CREATE_ROLES, PermissionEnums.EDIT_ROLES],
    isArray: true,
    required: false,
    type: String,
  })
  @IsEnum(PermissionEnums, { each: true, message: 'Invalid permission in rights' })
  @IsString({ each: true, message: 'items inside rights must be a string' })
  @IsArray({ message: 'rights must be an array' })
  @IsOptional()
  rights?: PermissionEnums[];

  @ApiProperty({
    title: 'Title',
    name: 'title',
    description: 'This is the status of a role',
    enum: StatusEnums,
    enumName: 'Statuses',
    example: StatusEnums.ACTIVE,
    required: false,
    type: String,
  })
  @IsOptional()
  status?: StatusEnums;
}
