import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsPhoneNumber, IsString, ValidateIf } from 'class-validator';

export class UpdateUserDto {
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
