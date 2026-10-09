import { Args, Context, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserReportService } from './user-report.service';
import { UserReportObject } from './types/user-report.object';
import { UserReportPageObject } from './types/user-report-page.object';
import { UserReportInput } from './dto/user-report.input';
import { GetUserReportsInput } from './dto/get-user-reports.input';
import { UpdateReportStatusInput } from './dto/update-report-status.input';
import { getAuthorization } from '../common/auth/gateway-auth.util';

@Resolver()
export class UserReportResolver {
  constructor(
    private readonly userReportService: UserReportService,
  ) {}

  @Mutation(() => UserReportObject)
  reportUser(
    @Args('input') input: UserReportInput,
    @Context() context: any ) {
      return this.userReportService.reportUser(input, getAuthorization(context));
  }

  @Query(() => UserReportPageObject)
  myUserReports(
    @Args('input') input: GetUserReportsInput,
    @Context() context: any) {
    return this.userReportService.myUserReports( input, getAuthorization(context));
  }


  @Query(() => UserReportPageObject)
  adminUserReports(
    @Args('input')
    input: GetUserReportsInput,

    @Context() context: any,
  ) {
    return this.userReportService.adminUserReports(
      input,
      getAuthorization(context),
    );
  }

  @Query(() => UserReportObject)
  adminUserReport(
    @Args('id', { type: () => ID}) id: string,
    @Context() context: any ) {
      return this.userReportService.adminUserReport( id, getAuthorization(context));
  }

  @Mutation(() => UserReportObject)
  updateUserReportStatus(
    @Args('reportId', { type: () => ID }) reportId: string,
    @Args('input') input: UpdateReportStatusInput,
    @Context() context: any) {
       return this.userReportService.updateUserReportStatus( reportId, input, getAuthorization(context));
  }
}