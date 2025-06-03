import { ResponseMessage } from '@decorators/responseMessage.decorator';
import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { RolesService } from '@role/roles.service';
import { CreateRoleDto } from '@role/dto/create-role.dto';
import { ReadRolesDto } from '@role/dto/read-role.dto';
import { ReadPaginatedRolesDto } from '@role/dto/read-paginated-role';
import { UpdateRoleDto } from '@role/dto/update-role.dto';
import { JwtAuthGuard } from '@auth/guards/auth.guard';
import { RbacGuard } from '@auth/guards/rbac.guard';
import { AllowedPermissions } from '@decorators/allowedPermissions.decorator';
import { PermissionEnums } from '@enums/permissions.enum';
import { ApiParam } from '@nestjs/swagger';

@Controller('roles')
@UseGuards(JwtAuthGuard)
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}
  @ResponseMessage('Role Created Successfully')
  @AllowedPermissions(PermissionEnums.CREATE_ROLES)
  @UseGuards(RbacGuard)
  @Post()
  createRole(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.createRole(createRoleDto);
  }

  // TODO: implement cursor based pagination for all data reads for optimization
  @ResponseMessage('SUCCESS')
  @AllowedPermissions(
    PermissionEnums.CREATE_ROLES,
    PermissionEnums.READ_ROLES,
    PermissionEnums.EDIT_ROLES,
    PermissionEnums.DELETE_ROLES,
  )
  @UseGuards(RbacGuard)
  @Get()
  readRoles(@Query() readRolesDto: ReadRolesDto) {
    return this.rolesService.readCursorBasedRoles(readRolesDto);
  }

  @ResponseMessage('SUCCESS')
  @AllowedPermissions(
    PermissionEnums.CREATE_ROLES,
    PermissionEnums.READ_ROLES,
    PermissionEnums.EDIT_ROLES,
    PermissionEnums.DELETE_ROLES,
  )
  @UseGuards(RbacGuard)
  @Get('/paginated')
  readPaginatedRoles(@Query() readPaginatedRolesDto: ReadPaginatedRolesDto) {
    return this.rolesService.readPaginatedRoles(readPaginatedRolesDto);
  }

  @ResponseMessage('SUCCESS')
  @ApiParam({
    name: 'id',
    description: 'This is the id of a role',
    example: '6806287ea2d840de8bee3064',
    required: true,
    type: String,
  })
  @AllowedPermissions(
    PermissionEnums.CREATE_ROLES,
    PermissionEnums.READ_ROLES,
    PermissionEnums.EDIT_ROLES,
    PermissionEnums.DELETE_ROLES,
  )
  @UseGuards(RbacGuard)
  @Get('/:id')
  readRoleById(@Param('id') id: string) {
    return this.rolesService.readRoleById(id);
  }

  @ResponseMessage('Role Updated Successfully')
  @AllowedPermissions(PermissionEnums.EDIT_ROLES)
  @UseGuards(RbacGuard)
  @Put('/:id')
  updateRole(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return [id, updateRoleDto];
  }

  @ResponseMessage('Role Deleted Successfully')
  @ApiParam({
    name: 'id',
    description: 'This is the id of a role',
    example: '6806287ea2d840de8bee3064',
    required: true,
    type: String,
  })
  @AllowedPermissions(PermissionEnums.EDIT_ROLES, PermissionEnums.DELETE_ROLES)
  @UseGuards(RbacGuard)
  @Delete('/:id')
  deleteRole(@Param('id') id: string) {
    return this.rolesService.deleteRole(id);
  }
}
