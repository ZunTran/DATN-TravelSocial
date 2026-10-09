import { gql } from '@apollo/client';

export const GET_SUGGESTED_USERS_BY_INTERESTS = gql`
  query GetSuggestedUsersByInterests {
    getSuggestedUsersByInterests {
      id
      username
      display_name
      avatar_url
      commonInterestsCount
    }
  }
`;

