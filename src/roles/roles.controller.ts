import { ResponseMessage } from '@decorators/responseMessage.decorator';
import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { RolesService } from './roles.service';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}
  @ResponseMessage('Role Created Successfully')
  @Post('')
  createRole(@Body() createRoleDto: string) {
    return createRoleDto;
  }

  @ResponseMessage('SUCCESS')
  @Get('')
  readRoles(@Query() readRolesDto: string) {
    return readRolesDto;
  }

  @ResponseMessage('SUCCESS')
  @Get('/paginated')
  readPaginatedRoles(@Query() readPaginatedRolesDto: string) {
    return readPaginatedRolesDto;
  }

  @ResponseMessage('Role Updated Successfully')
  @Put('/:id')
  updateRole(@Param('id') id: string, @Body() updateRoleDto: string) {
    return [id, updateRoleDto];
  }

  @ResponseMessage('Role Deleted Successfully')
  @Delete('/:id')
  deleteRole(@Param('id') id: string) {
    return id;
  }
}
