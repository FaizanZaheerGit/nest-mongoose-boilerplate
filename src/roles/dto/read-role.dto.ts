import { StatusEnums } from '@enums/status.enums';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsOptional, ValidateIf } from 'class-validator';

export class ReadRolesDto {
  @ApiProperty({
    title: 'Title',
    name: 'title',
    description: 'This is the title of a role',
    example: 'First Role',
    required: false,
    type: String,
  })
  @IsOptional()
  title?: string;

  @ApiProperty({
    title: 'Status',
    name: 'status',
    description: 'This is the status of a role',
    example: StatusEnums.ACTIVE,
    enum: StatusEnums,
    enumName: 'Statuses',
    required: false,
    type: String,
  })
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  @ValidateIf((obj) => obj.status !== undefined && obj.status !== null && obj.status !== '')
  @IsEnum(StatusEnums, { message: 'Invalid status' })
  @IsOptional()
  status?: StatusEnums;

  @ApiProperty({
    title: 'Cursor',
    name: 'cursor',
    description: 'This is the id of next user in the cursor based pagination',
    required: false,
    type: String,
  })
  @IsOptional()
  cursor?: string;

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
  limit: number;
}
