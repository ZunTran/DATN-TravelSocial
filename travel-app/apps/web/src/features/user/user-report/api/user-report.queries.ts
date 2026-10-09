import { gql } from '@apollo/client';

export const MY_USER_REPORTS = gql`
  query MyUserReports($input: GetUserReportsInput!) {
    myUserReports(input: $input) {
      data {
        id
        reporter_id
        reported_user_id
        reason
        status
        handled_by
        handled_at
        created_at

        reporter {
          id
          username
          display_name
          avatar_url
        }

        reported_user {
          id
          username
          display_name
          avatar_url
        }
      }

      total
      page
      limit
      totalPages
    }
  }
`;

export const ADMIN_USER_REPORTS = gql`
  query AdminUserReports($input: GetUserReportsInput!) {
    adminUserReports(input: $input) {
      data {
        id
        reporter_id
        reported_user_id
        reason
        status
        handled_by
        handled_at
        created_at

        reporter {
          id
          username
          display_name
          avatar_url
        }

        reported_user {
          id
          username
          display_name
          avatar_url
        }
      }

      total
      page
      limit
      totalPages
    }
  }
`;

export const ADMIN_USER_REPORT = gql`
  query AdminUserReport($id: ID!) {
    adminUserReport(id: $id) {
      id
      reporter_id
      reported_user_id
      reason
      status
      handled_by
      handled_at
      created_at

      reporter {
        id
        username
        display_name
        avatar_url
      }

      reported_user {
        id
        username
        display_name
        avatar_url
      }
    }
  }
`;