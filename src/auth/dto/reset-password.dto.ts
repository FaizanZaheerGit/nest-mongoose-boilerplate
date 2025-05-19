import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsString, IsStrongPassword, IsUUID } from 'class-validator';

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
    description: 'This is the token for verifying user for update password',
    example: '4d93efa6-85e8-4886-9958-15b3f3cf1fc6',
    required: true,
    type: String,
  })
  @IsUUID('4', { message: 'token must be a valid UUID' })
  @IsString({ message: 'token must be a string' })
  @IsNotEmpty({ message: 'token is required' })
  token!: string;

  @ApiProperty({
    title: 'New Password',
    name: 'newPassword',
    description: 'This is the new password of a user',
    example: 'Abc123',
    required: true,
    type: String,
  })
  @IsStrongPassword(
    { minLength: 8, minLowercase: 1, minNumbers: 1, minSymbols: 1, minUppercase: 1 },
    {
      message:
        'User a stronger password (minimum 8 letters, 1 lowecase, 1 uppercase, 1 number, 1 symbols)',
    },
  )
  @IsString({ message: 'password must be a string' })
  @IsNotEmpty({ message: 'password is required' })
  newPassword!: string;
}
