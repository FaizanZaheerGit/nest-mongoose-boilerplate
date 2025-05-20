import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { StatusEnums } from '@utils/enums/status.enums';

export class ReadUsersDto {
  @ApiProperty({
    title: 'Email',
    name: 'email',
    description: 'This is the email of a user',
    example: 'abcd@yopmail.com',
    required: false,
    type: String,
  })
  @IsOptional()
  email?: string;

  @ApiProperty({
    title: 'Name',
    name: 'name',
    description: 'This is the name of a user',
    example: 'John',
    required: false,
    type: String,
  })
  @IsOptional()
  name?: string;

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
  @IsOptional()
  status?: StatusEnums;
}
