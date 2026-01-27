import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class DeleteUserDto {
  @ApiProperty({
    title: 'User Id',
    name: 'userId',
    description: 'This is the id of a user',
    example: '6806287ea2d840de8bee3064',
    type: String,
  })
  @IsMongoId({ message: 'user id must be a valid Mongo Id' })
  @IsString({ message: 'user id must be a string' })
  @IsNotEmpty({ message: 'user id is required' })
  userId!: string;
}
