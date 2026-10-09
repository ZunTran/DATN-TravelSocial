import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { account_role } from '@prisma/client';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles =
      this.reflector.getAllAndOverride<account_role[]>(
        ROLES_KEY,
        [
          context.getHandler(),
          context.getClass(),
        ],
      );

    if (!requiredRoles) {
      return true;
    }

    const ctx = GqlExecutionContext.create(context);
    const req = ctx.getContext().req;

    console.log(
      '[ROLES GUARD] USER:',
      req?.user,
    );

    console.log(
      '[ROLES GUARD] REQUIRED ROLES:',
      requiredRoles,
    );

    if (!req?.user || !req.user.role) {
      throw new ForbiddenException(
        'Bạn chưa đăng nhập hoặc không có quyền truy cập!',
      );
    }

    const hasRole = requiredRoles.includes(
      req.user.role,
    );

    if (!hasRole) {
      throw new ForbiddenException(
        'Bạn không có quyền hạn (Admin) để thực hiện hành động này!',
      );
    }

    return true;
  }
}