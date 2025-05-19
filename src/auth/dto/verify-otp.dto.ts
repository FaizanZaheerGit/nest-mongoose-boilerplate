import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsString, Matches } from 'class-validator';

export class ResetPasswordDto {
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

  @ApiProperty({
    title: 'Token',
    name: 'token',
    description: 'This is the token for verifying a user',
    example: '123456',
    required: true,
    type: String,
  })
  @Matches(/^\d{6}$/, { message: 'Token must be exactly 6 digits.' })
  @IsString({ message: 'token must be a string' })
  @IsNotEmpty({ message: 'token is required' })
  token!: string;
}
