import { gql } from '@apollo/client';

export const ADMIN_USER_DASHBOARD_QUERY = gql`
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