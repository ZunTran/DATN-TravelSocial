import { gql } from '@apollo/client';

export const ADMIN_ACCOUNTS_QUERY = gql`
  query AdminAccounts(
    $filter: AdminAccountFilterGatewayInput
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