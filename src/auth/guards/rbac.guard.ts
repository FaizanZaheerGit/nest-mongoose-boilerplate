/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return */
import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@role/models/roles.model';

@Injectable()
export class RbacGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    const { user } = ctx.switchToHttp().getRequest();
    if (!user) {
      throw new HttpException(`Unauthorized Access`, HttpStatus.UNAUTHORIZED);
    }
    const allowedPermissions = this.reflector.getAllAndOverride<any>('permissions', [
      ctx.getHandler(),
      ctx.getClass(),
    ]);
    console.log(`Allowed Roles:  ${JSON.stringify(allowedPermissions)}`);
    if (!allowedPermissions) {
      return true;
    }

    const currentUserRights = user?.roles?.flatMap((role: Role) => role.rights);
    if (!currentUserRights || !currentUserRights?.length) {
      console.error(`Unauthorized Access from RBAC Guard`);
      throw new HttpException(`You are not authorized for this action!`, HttpStatus.FORBIDDEN);
    }
    const hasPermission = allowedPermissions.some((permission) =>
      currentUserRights.includes(permission),
    );
    if (!hasPermission) {
      console.error(`Unauthorized Access from RBAC guard`);
      throw new HttpException(`You are not authorized this action!`, HttpStatus.FORBIDDEN);
    }
    return true;
  }
}
