import { Injectable } from '@nestjs/common';

import { UserGraphqlClient } from '../user/clients/user-graphql-client';

@Injectable()
export class AdminGatewayService {
  constructor(
    private readonly userGraphqlClient: UserGraphqlClient,
  ) {}

  async getUserDashboard(
    days: number | null,
    authorization?: string,
  ) {
    const query = `
      query AdminUserDashboard($days: Int) {
        adminUserDashboard(days: $days) {
          users {
            total
            newUsers
            active
            banned
            locked
          }

          sessions {
            sessions
            uniqueUsers
            activeSessions
          }

          registrationGrowth {
            percentage
            trend
          }

          userGrowthByDay {
            date
            count
          }

          sessionActivityByDay {
            date
            sessions
            users
          }
        }
      }
    `;

    const result =
      await this.userGraphqlClient.execute<{
        adminUserDashboard: any;
      }>(
        query,
        {
          days,
        },
        authorization,
      );

    return this.normalizeDashboardDates(
      result.adminUserDashboard,
    );
  }


async getAdminAccounts(
  filter: {
    search?: string;
    page?: number;
    limit?: number;
  } = {},
  authorization?: string,
) {
  console.log(
    '🔥 [ADMIN GATEWAY SERVICE] filter:',
    JSON.stringify(filter, null, 2),
  );

  const query = `
    query AdminAccounts(
      $filter: AdminAccountFilterInput
    ) {
      adminAccounts(filter: $filter) {
        items {
          id
          email
          username
          displayName
          status
          lastLoginAt
          createdAt
        }

        total
        page
        limit
        totalPages
      }
    }
  `;

  const variables = {
    filter: {
      search: filter.search,
      page: filter.page,
      limit: filter.limit,
    },
  };

  console.log(
    '🔥 [ADMIN GATEWAY SERVICE] variables:',
    JSON.stringify(variables, null, 2),
  );

  const result =
    await this.userGraphqlClient.execute<{
      adminAccounts: any;
    }>(
      query,
      variables,
      authorization,
    );

  console.log(
    '🔥 [ADMIN GATEWAY SERVICE] response:',
    JSON.stringify(result.adminAccounts, null, 2),
  );

  return this.normalizeAccountDates(
    result.adminAccounts,
  );
}


  private normalizeDashboardDates(
    dashboard: any,
  ) {
    if (!dashboard) {
      return dashboard;
    }

    return {
      ...dashboard,

      userGrowthByDay:
        dashboard.userGrowthByDay?.map(
          (item: any) => ({
            ...item,

            date: item.date
              ? new Date(item.date)
              : null,
          }),
        ) ?? [],

      sessionActivityByDay:
        dashboard.sessionActivityByDay?.map(
          (item: any) => ({
            ...item,

            date: item.date
              ? new Date(item.date)
              : null,
          }),
        ) ?? [],
    };
  }

  private normalizeAccountDates(
    result: any,
  ) {
    if (!result) {
      return result;
    }

    return {
      ...result,

      items:
        result.items?.map(
          (item: any) => ({
            ...item,

            lastLoginAt:
              item.lastLoginAt
                ? new Date(
                    item.lastLoginAt,
                  )
                : null,

            createdAt:
              item.createdAt
                ? new Date(
                    item.createdAt,
                  )
                : null,
          }),
        ) ?? [],
    };
  }
}