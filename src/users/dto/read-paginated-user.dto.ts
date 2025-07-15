import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsOptional, ValidateIf } from 'class-validator';
import { StatusEnums } from '@utils/enums/status.enums';

export class ReadPaginatedUsersDto {
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
    title: 'Phone Number',
    name: 'phoneNumber',
    description: 'This is the phone number of a user',
    example: '+11234567890',
    required: false,
    type: String,
  })
  @IsOptional()
  phoneNumber?: string;

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
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  @ValidateIf((obj) => obj.status !== undefined && obj.status !== null && obj.status !== '')
  @IsEnum(StatusEnums, { message: 'Invalid status' })
  @IsOptional()
  status?: StatusEnums;

  @ApiProperty({
    title: 'Page',
    name: 'page',
    description: 'This is the page number for paginated data',
    example: '1',
    required: true,
    type: String,
  })
  @Transform(({ value }) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return parseInt(value, 10);
  })
  // @IsNumberString({ no_symbols: true }, { message: 'page must be a valid number without decimal' })
  @IsNotEmpty({ message: 'page is required' })
  page!: number;

  @ApiProperty({
    title: 'Limit',
    name: 'limit',
    description: 'This is the limit per page for paginated data',
    example: '10',
    required: true,
    type: String,
  })
  @Transform(({ value }) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return parseInt(value, 10);
  })
  // @IsNumberString({ no_symbols: true }, { message: 'page must be a valid number without decimal' })
  @IsNotEmpty({ message: 'limit is required' })
  limit!: number;
}
