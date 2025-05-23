import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, ValidateIf } from 'class-validator';
import { UpdateUserDto } from '@user/dto/update-user.dto';
import { StatusEnums } from '@utils/enums/status.enums';
import { UserTypeEnums } from '@utils/enums/userType.enums';

export class UpdateUserAdminDto extends UpdateUserDto {
  @ApiProperty({
    title: 'Status',
    name: 'status',
    description: 'This is the status of a user',
    enum: StatusEnums,
    enumName: 'Statuses',
    example: StatusEnums.ACTIVE,
    required: false,
    type: String,
  })
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  @ValidateIf((obj) => obj.status !== undefined && obj.status !== null && obj.status !== '')
  @IsEnum(StatusEnums, { message: 'Invalid status' })
  @IsString({ message: 'status must be a string' })
  @IsOptional()
  status?: StatusEnums;

  @ApiProperty({
    title: 'User Type',
    name: 'userType',
    description: 'This is the user type of a user',
    enum: UserTypeEnums,
    enumName: 'User Types',
    example: UserTypeEnums.USER,
    required: false,
    type: String,
  })
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  @ValidateIf((obj) => obj.userType !== undefined && obj.userType !== null && obj.userType !== '')
  @IsEnum(UserTypeEnums, { message: 'Invalid user type' })
  @IsString({ message: 'user type must be a string' })
  @IsOptional()
  userType?: UserTypeEnums;
}
