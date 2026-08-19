import { SetMetadata } from '@nestjs/common';
import { account_role } from '@prisma/client';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: account_role[]) => SetMetadata(ROLES_KEY, roles);