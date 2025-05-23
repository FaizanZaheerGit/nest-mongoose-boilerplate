import { ResponseMessage } from '@decorators/responseMessage.decorator';
import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { RolesService } from '@role/roles.service';
import { CreateRoleDto } from '@role/dto/create-role.dto';
import { ReadRolesDto } from '@role/dto/read-role.dto';
import { ReadPaginatedRolesDto } from '@role/dto/read-paginated-role';
import { UpdateRoleDto } from '@role/dto/update-role.dto';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}
  @ResponseMessage('Role Created Successfully')
  @Post('')
  createRole(@Body() createRoleDto: CreateRoleDto) {
    return createRoleDto;
  }

  @ResponseMessage('SUCCESS')
  @Get('')
  readRoles(@Query() readRolesDto: ReadRolesDto) {
    return readRolesDto;
  }

  @ResponseMessage('SUCCESS')
  @Get('/paginated')
  readPaginatedRoles(@Query() readPaginatedRolesDto: ReadPaginatedRolesDto) {
    return readPaginatedRolesDto;
  }

  @ResponseMessage('Role Updated Successfully')
  @Put('/:id')
  updateRole(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return [id, updateRoleDto];
  }

  @ResponseMessage('Role Deleted Successfully')
  @Delete('/:id')
  deleteRole(@Param('id') id: string) {
    return id;
  }
}
