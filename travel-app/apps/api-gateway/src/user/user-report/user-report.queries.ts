export const REPORT_USER = `
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

export const MY_USER_REPORTS = `
  query MyUserReports($input: PaginationInput!) {
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

export const ADMIN_USER_REPORTS = `
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

export const ADMIN_USER_REPORT = `
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

export const UPDATE_USER_REPORT_STATUS = `
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