import { DefaultRoleEnums } from '@enums/defaultRoles.enum';
import { PermissionEnums } from '@enums/permissions.enum';
import { StatusEnums } from '@enums/status.enums';
import { Role } from '@role/models/roles.model';

export const roleDefaultValues: Role[] = [
  {
    title: DefaultRoleEnums.ADMINISTRATOR,
    rights: [
      PermissionEnums.CREATE_USERS,
      PermissionEnums.READ_USERS,
      PermissionEnums.EDIT_USERS,
      PermissionEnums.DELETE_USERS,
      PermissionEnums.CREATE_ROLES,
      PermissionEnums.EDIT_ROLES,
      PermissionEnums.READ_ROLES,
      PermissionEnums.DELETE_ROLES,
    ],
    status: StatusEnums.ACTIVE,
  },
  {
    title: DefaultRoleEnums.USER_MANAGER,
    rights: [
      PermissionEnums.CREATE_USERS,
      PermissionEnums.READ_USERS,
      PermissionEnums.EDIT_USERS,
      PermissionEnums.DELETE_USERS,
    ],
    status: StatusEnums.ACTIVE,
  },
  {
    title: DefaultRoleEnums.ROLE_MANAGER,
    rights: [
      PermissionEnums.CREATE_ROLES,
      PermissionEnums.READ_ROLES,
      PermissionEnums.EDIT_ROLES,
      PermissionEnums.DELETE_ROLES,
    ],
    status: StatusEnums.ACTIVE,
  },
];
