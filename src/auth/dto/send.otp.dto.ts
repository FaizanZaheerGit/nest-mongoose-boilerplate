import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class SendOtpDto {
  @ApiProperty({
    title: 'User ID',
    name: 'userId',
    description: 'This is the id of a user',
    example: '6806287ea2d840de8bee3064',
    required: true,
    type: String,
  })
  @IsMongoId({ message: 'user Id must be a valid Mongo ID' })
  @IsString({ message: 'user id must be a string' })
  @IsNotEmpty({ message: 'user id is required' })
  userId!: string;
}
