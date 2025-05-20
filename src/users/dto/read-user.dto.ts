import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsOptional, ValidateIf } from 'class-validator';
import { StatusEnums } from '@utils/enums/status.enums';

export class ReadUsersDto {
  @ApiProperty({
    title: 'Id',
    name: '_id',
    description: 'This is the id of a user',
    example: '6806287ea2d840de8bee3064',
    type: String,
  })
  @ValidateIf(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    (obj) => obj._id !== undefined && obj._id !== null && obj._id !== '',
  )
  @IsMongoId({ message: '_id must be a valid Mongo Id' })
  @IsOptional()
  _id?: string;

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
