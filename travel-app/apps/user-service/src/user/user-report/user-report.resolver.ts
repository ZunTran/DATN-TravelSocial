import {Args,ID,Mutation,Query,Resolver} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { UserReportService } from './user-report.service';
import { JwtAuthGuard } from '../../common/auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/auth/decorators/current-user.decorator';
import type { ActiveUserData } from '../../common/auth/interfaces/user-data.interface';
import { PaginationInput } from '../../common/dto/pagination.input';
import { UserReportInput } from './dto/user-report.dto';
import { GetUserReportsInput } from './dto/admin-user-report.dto';
import { UpdateReportStatusInput } from './dto/update-report-status.dto';

import { UserReportObject } from './objects/user-report.object';
import { UserReportPageObject } from './objects/user-report-page.object';
import { Roles } from '../../common/auth/decorators/roles.decorator';
import { account_role } from '@prisma/client';
import { RolesGuard } from '../../common/auth/guards/roles.guard';

@Resolver()
export class UserReportResolver {
  constructor(
    private readonly service: UserReportService,
  ) {}

  @Mutation(() => UserReportObject)
  @UseGuards(JwtAuthGuard)
  reportUser(@CurrentUser() user: ActiveUserData,
    @Args('input') input: UserReportInput,) {
    return this.service.createReport(user.accountId,input,
    );
  }

  @Query(() => UserReportPageObject)
  @UseGuards(JwtAuthGuard)
  myReports(@CurrentUser() user: ActiveUserData,@Args('input') input: PaginationInput) {
    return this.service.myReports(
      user.accountId,
      input.page,
      input.limit,
    );
  }

  @Query(() => UserReportPageObject)
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles(account_role.ADMIN)
  adminUserReports(@Args('input') input: GetUserReportsInput,) {
    return this.service.getReports(input);
  }

  @Query(() => UserReportObject)
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles(account_role.ADMIN)
  adminUserReport(@Args('id', {type: () => ID}) id: string) {
    return this.service.getReportById(id);
  }

  @Mutation(() => UserReportObject)
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles(account_role.ADMIN)
  updateUserReportStatus( @CurrentUser() user: ActiveUserData,
    @Args('reportId', {type: () => ID}) reportId: string,
    @Args('input') input: UpdateReportStatusInput,) {
    return this.service.updateReportStatus(
      reportId,
      user.accountId,
      input,
    );
  }
}