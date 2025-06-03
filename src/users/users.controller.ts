import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from '@user/users.service';
import { CreateUserDto } from '@user/dto/create-user.dto';
import { UpdateUserDto } from '@user/dto/update-user.dto';
import { ResponseMessage } from '@utils/decorators/responseMessage.decorator';
import { ReadUsersDto } from '@user/dto/read-user.dto';
import { ReadPaginatedUsersDto } from '@user/dto/read-paginated-user.dto';
import { ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '@auth/guards/auth.guard';
import { RbacGuard } from '@auth/guards/rbac.guard';
import { AllowedPermissions } from '@decorators/allowedPermissions.decorator';
import { PermissionEnums } from '@enums/permissions.enum';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ResponseMessage('User created successfully')
  @ApiBearerAuth()
  @AllowedPermissions(PermissionEnums.CREATE_USERS)
  @UseGuards(RbacGuard)
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  // TODO: implement cursor based pagination for all data reads for optimizations
  @ResponseMessage('SUCCESS')
  @ApiBearerAuth()
  @AllowedPermissions(
    PermissionEnums.CREATE_USERS,
    PermissionEnums.READ_USERS,
    PermissionEnums.EDIT_USERS,
    PermissionEnums.DELETE_USERS,
  )
  @UseGuards(RbacGuard)
  @Get()
  findAll(@Query() readUsersDto: ReadUsersDto) {
    return this.usersService.readCursorBasedUsers(readUsersDto);
  }

  @ResponseMessage('SUCCESS')
  @ApiBearerAuth()
  @AllowedPermissions(
    PermissionEnums.CREATE_USERS,
    PermissionEnums.READ_USERS,
    PermissionEnums.EDIT_USERS,
    PermissionEnums.DELETE_USERS,
  )
  @UseGuards(RbacGuard)
  @Get('/paginated')
  findPaginated(@Query() readPaginatedUsersDto: ReadPaginatedUsersDto) {
    return this.usersService.readPaginatedUsers(readPaginatedUsersDto);
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
  @AllowedPermissions(
    PermissionEnums.CREATE_USERS,
    PermissionEnums.READ_USERS,
    PermissionEnums.EDIT_USERS,
    PermissionEnums.DELETE_USERS,
  )
  @UseGuards(RbacGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.readUserById(id);
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
  @AllowedPermissions(PermissionEnums.EDIT_USERS)
  @UseGuards(RbacGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateUser(id, updateUserDto);
  }

  @ResponseMessage('User deleted successfully')
  @ApiBearerAuth()
  @AllowedPermissions(PermissionEnums.EDIT_USERS, PermissionEnums.DELETE_USERS)
  @UseGuards(RbacGuard)
  @Delete(':id')
  @ApiParam({
    name: 'id',
    description: 'Id of user to delete',
    type: String,
    required: true,
    example: '6806287ea2d840de8bee3064',
  })
  remove(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }
}
