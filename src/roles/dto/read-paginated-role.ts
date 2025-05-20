import { StatusEnums } from '@enums/status.enums';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumberString, IsOptional } from 'class-validator';

export class ReadPaginatedRolesDto {
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
  @IsNumberString({ no_symbols: true }, { message: 'page must be a valid number without decimal' })
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
  @IsNumberString({ no_symbols: true }, { message: 'page must be a valid number without decimal' })
  @IsNotEmpty({ message: 'limit is required' })
  limit!: number;
}
