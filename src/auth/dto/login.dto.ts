import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    title: 'Email',
    name: 'email',
    description: 'This is the e-mail of a user',
    example: 'abcd@gmail.com',
    required: true,
    type: String,
  })
  @IsEmail({}, { message: 'Invalid e-mail format' })
  @IsString({ message: 'email must be a string' })
  @IsNotEmpty({ message: 'email is  required' })
  email!: string;

  @ApiProperty({
    title: 'Password',
    name: 'password',
    description: 'This is the password of a user',
    example: 'Abc123',
    required: true,
    type: String,
  })
  @IsString({ message: 'password must be a string' })
  @IsNotEmpty({ message: 'password is required' })
  password!: string;
}
