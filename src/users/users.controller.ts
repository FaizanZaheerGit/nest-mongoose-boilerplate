import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { UsersService } from '@user/users.service';
import { CreateUserDto } from '@user/dto/create-user.dto';
import { UpdateUserDto } from '@user/dto/update-user.dto';
import { ResponseMessage } from '@utils/decorators/responseMessage.decorator';
import { ReadUsersDto } from '@user/dto/read-user.dto';
import { ReadPaginatedUsersDto } from '@user/dto/read-paginated-user.dto';
import { ApiBearerAuth, ApiParam } from '@nestjs/swagger';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ResponseMessage('User created successfully')
  @ApiBearerAuth()
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return createUserDto;
  }

  @ResponseMessage('SUCCESS')
  @ApiBearerAuth()
  @Get()
  findAll(@Query() readUsersDto: ReadUsersDto) {
    return readUsersDto;
  }

  @ResponseMessage('SUCCESS')
  @ApiBearerAuth()
  @Get('/paginated')
  findPaginated(@Query() readPaginatedUsersDto: ReadPaginatedUsersDto) {
    return readPaginatedUsersDto;
  }

  @ResponseMessage('SUCCESS')
  @ApiParam({
    name: 'id',
    description: 'Id of user to delete',
    type: String,
    required: true,
    example: '6806287ea2d840de8bee3064',
  })
  @ApiBearerAuth()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return id;
  }

  @ResponseMessage('User updated successfully')
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'Id of user to delete',
    type: String,
    required: true,
    example: '6806287ea2d840de8bee3064',
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return [id, updateUserDto];
  }

  @ResponseMessage('User deleted successfully')
  @ApiBearerAuth()
  @Delete(':id')
  @ApiParam({
    name: 'id',
    description: 'Id of user to delete',
    type: String,
    required: true,
    example: '6806287ea2d840de8bee3064',
  })
  remove(@Param('id') id: string) {
    return id;
  }
}
