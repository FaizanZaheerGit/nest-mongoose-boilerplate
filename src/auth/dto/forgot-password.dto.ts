import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ForgotPasswordDto {
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
}
