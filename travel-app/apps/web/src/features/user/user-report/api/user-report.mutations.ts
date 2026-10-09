import { gql } from '@apollo/client';

export const REPORT_USER = gql`
  mutation ReportUser($input: UserReportInput!) {
    reportUser(input: $input) {
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

export const UPDATE_USER_REPORT_STATUS = gql`
  mutation UpdateUserReportStatus(
    $reportId: ID!
    $input: UpdateReportStatusInput!
  ) {
    updateUserReportStatus(
      reportId: $reportId
      input: $input
    ) {
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