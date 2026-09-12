import {
  Args,
  Int,
  Query,
  Resolver,
  Context,
} from '@nestjs/graphql';

import { AdminGatewayService } from './admin-gateway.service';
import { AdminUserDashboardGatewayObject } from './objects/admin-user-dashboard-gateway.object';
import { AdminAccountFilterGatewayInput, AdminAccountPageGatewayObject } from './objects/admin-account-gateway.object';

@Resolver()
export class AdminGatewayResolver {
  constructor(
    private readonly adminGatewayService: AdminGatewayService,
  ) {}

  @Query(() => AdminUserDashboardGatewayObject)
  async adminUserDashboard(
    @Args('days', {
    type: () => Int,
    nullable: true,
    defaultValue: 30,
    })
    days: number | null,
    @Context() context: any) {
    const authorization = context?.req?.headers?.authorization;
    console.log(
    '[ADMIN GATEWAY]',authorization ? 'AUTH EXISTS' : 'NO AUTH',
  );

    return this.adminGatewayService.getUserDashboard( days, authorization);
  }

@Query(() => AdminAccountPageGatewayObject)
async adminAccounts(
  @Args('filter', {
    type: () => AdminAccountFilterGatewayInput,
    nullable: true,
  })
  filter:
    | AdminAccountFilterGatewayInput
    | undefined,

  @Context() context: any,
) {
  const authorization =
    context?.req?.headers?.authorization;

  return this.adminGatewayService.getAdminAccounts(
    filter ?? {},
    authorization,
  );
}


}