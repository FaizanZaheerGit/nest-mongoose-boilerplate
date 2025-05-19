import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
  ValidateIf,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    title: 'Email',
    name: 'email',
    description: 'This is the e-mail of a user',
    example: 'abcd@yopmail.com',
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
    example: 'Abcd1234#',
    required: true,
    type: String,
  })
  @IsStrongPassword(
    { minLength: 8, minLowercase: 1, minNumbers: 1, minSymbols: 1, minUppercase: 1 },
    {
      message:
        'Use a strong password. Make sure password has at least 8 characters, 1 lowercase character, 1 uppercase charcter, 1 number and 1 special symbol',
    },
  )
  @IsString({ message: 'password must be a string' })
  @IsNotEmpty({ message: 'password is  required' })
  password!: string;

  @ApiProperty({
    title: 'name',
    name: 'name',
    description: 'This is the name of a user',
    example: 'John Doe',
    type: String,
  })
  @IsString({ message: 'name must be a string' })
  @IsOptional()
  name?: string;

  @ApiProperty({
    title: 'Phone Number',
    name: 'phoneNumber',
    description: 'This is the phone number of a user',
    example: '+12481234567',
    type: String,
  })
  @ValidateIf(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    (obj) => obj.phoneNumber !== undefined && obj.phoneNumber !== null && obj.phoneNumber !== '',
  )
  @IsPhoneNumber('US', { message: 'Phone Number must be a valid US phone number' })
  @IsString({ message: 'phone number must be a string' })
  @IsOptional()
  phoneNumber?: string;
}
