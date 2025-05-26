import { PermissionEnums } from '@enums/permissions.enum';
import { SetMetadata } from '@nestjs/common';

export const AllowedPermissions = (...permissions: PermissionEnums[]) =>
  SetMetadata('permissions', permissions);
