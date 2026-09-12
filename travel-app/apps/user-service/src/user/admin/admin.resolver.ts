import {
  Args,
  Int,
  Mutation,
  Query,
  Resolver,
  Context
} from '@nestjs/graphql';

import { AdminService } from './admin.service';
import { account_role } from '@prisma/client';
import { AdminResponseObject } from './objects/admin-response.object';

import {
  AdminUserDashboardObject,
} from './objects/admin-dashboard.object';
import { RolesGuard } from '../../common/auth/guards/roles.guard';
import { JwtAuthGuard } from '../../common/auth/guards/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';
import { Roles } from '../../common/auth/decorators/roles.decorator';
import { AdminAccountFilterInput, AdminAccountPageObject } from './objects/admin-account.object';

@Resolver()
export class AdminResolver {
  constructor(
    private readonly adminService: AdminService,
  ) {}


  @Mutation(() => AdminResponseObject)
  async seedDefaultAdmin() {
    return this.adminService.seedDefaultAdmin();
  }


  @Query(() => AdminUserDashboardObject)
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(account_role.ADMIN)
async adminUserDashboard(
  @Args('days', {
    type: () => Int,
    nullable: true,
    defaultValue: 30,
  })
  days: number | null,
  @Context() context: any) {
  console.log(
    '[USER ADMIN RESOLVER] REQ AUTH:',
    context?.req?.headers?.authorization ? 'EXISTS' : 'MISSING');

  return this.adminService.getUserDashboard(days);
}

@Query(() => AdminAccountPageObject)
async adminAccounts(
  @Args('filter', {
    type: () => AdminAccountFilterInput,
    nullable: true,
  })
  filter?: AdminAccountFilterInput,
) {
  console.log(
    '🔥 [USER RESOLVER] filter:',
    JSON.stringify(filter, null, 2),
  );

  console.log(
    '🔥 [USER RESOLVER] page:',
    filter?.page,
  );

  return this.adminService.getAdminAccounts(
    filter,
  );
}
}