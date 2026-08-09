import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean {
    const roles =
      this.reflector.get<string[]>(
        'roles',
        context.getHandler(),
      );

    if (!roles || roles.length === 0) {
      return true;
    }

    const ctx =
      GqlExecutionContext.create(context);

    const user =
      ctx.getContext().req.user;

    if (!user) {
      throw new ForbiddenException(
        'Không xác định được user',
      );
    }

    if (!roles.includes(user.role)) {
      throw new ForbiddenException(
        'Bạn không có quyền thực hiện thao tác này',
      );
    }

    return true;
  }
}