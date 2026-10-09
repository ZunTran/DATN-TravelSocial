import { gql } from '@apollo/client';

export const SEARCH_USERS_QUERY = gql`
  query SearchUsers($input: GatewaySearchUserInput!) {
    searchUsers(input: $input) {
      data {
        id
        username
        display_name
        avatar_url
        commonInterestsCount
      }
      total
      page
      limit
      totalPages
    }
  }
`;