import { Injectable } from '@nestjs/common';
import { UserGraphqlClient } from '../clients/user-graphql-client';
import { UserReportInput } from './dto/user-report.input';
import { GetUserReportsInput } from './dto/get-user-reports.input';
import { UpdateReportStatusInput } from './dto/update-report-status.input';

import {
  REPORT_USER,
  MY_USER_REPORTS,
  ADMIN_USER_REPORTS,
  ADMIN_USER_REPORT,
  UPDATE_USER_REPORT_STATUS,
} from './user-report.queries';

@Injectable()
export class UserReportService {
  constructor(
    private readonly userGraphqlClient: UserGraphqlClient,
  ) {}

  private normalizeReport(report: any) {
    if (!report) {
      return report;
    }

    return {
      ...report,
      created_at: report.created_at
        ? new Date(report.created_at)
        : null,
      handled_at: report.handled_at
        ? new Date(report.handled_at)
        : null,
    };
  }

  async reportUser(
    input: UserReportInput,
    authorization: string,
  ) {
    const result = await this.userGraphqlClient.execute<{
      reportUser: any;
    }>(
      REPORT_USER,
      {
        input,
      },
      authorization,
    );

    return this.normalizeReport(result.reportUser);
  }

  async myUserReports(
    input: GetUserReportsInput,
    authorization: string,
  ) {
    const result = await this.userGraphqlClient.execute<{
      myUserReports: any;
    }>(
      MY_USER_REPORTS,
      {
        input: {
          page: input.page,
          limit: input.limit,
        },
      },
      authorization,
    );

    const page = result.myUserReports;
    return {
      ...page,
      data: page.data.map((report: any) => this.normalizeReport(report)),
    };

  }

  async adminUserReports(
    input: GetUserReportsInput,
    authorization: string,
  ) {
    const result = await this.userGraphqlClient.execute<{
      adminUserReports: any;
    }>(
      ADMIN_USER_REPORTS,
      {
        input,
      },
      authorization,
    );

    const page = result.adminUserReports;
    return {
      ...page,
      data: page.data.map((report: any) => this.normalizeReport(report)),
    };
  }

  async adminUserReport(
    id: string,
    authorization: string,
  ) {
    const result = await this.userGraphqlClient.execute<{
      adminUserReport: any;
    }>(
      ADMIN_USER_REPORT,
      {
        id,
      },
      authorization,
    );

    return this.normalizeReport(result.adminUserReport);
  }

  async updateUserReportStatus(
    reportId: string,
    input: UpdateReportStatusInput,
    authorization: string,
  ) {
    const result = await this.userGraphqlClient.execute<{
      updateUserReportStatus: any;
    }>(
      UPDATE_USER_REPORT_STATUS,
      {
        reportId,
        input,
      },
      authorization,
    );

    return this.normalizeReport(result.updateUserReportStatus);
  }
}

