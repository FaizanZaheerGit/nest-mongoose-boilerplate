import { StatusEnums } from '@enums/status.enums';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, ValidateIf } from 'class-validator';

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
}
