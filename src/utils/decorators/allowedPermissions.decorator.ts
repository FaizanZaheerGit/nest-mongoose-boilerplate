import { PermissionEnums } from '@enums/permissions.enum';
import { SetMetadata } from '@nestjs/common';

export const allowedPermissions = (...permissions: PermissionEnums[]) =>
  SetMetadata('permissions', permissions);
