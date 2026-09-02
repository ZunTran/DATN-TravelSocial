import { gql } from "@apollo/client";

export const GET_INTEREST_TAGS = gql`
  query GetInterestTags {
    getInterestTags {
      id
      name
      icon_url
      created_at
    }
  }
`;

export const GET_MY_INTERESTS = gql`
  query GetMyInterests {
    getMyInterests {
      id
      name
      icon_url
      created_at
    }
  }
`;

export const UPDATE_MY_INTERESTS = gql`
  mutation UpdateMyInterests($interestIds: [ID!]!) {
    updateMyInterests(interestIds: $interestIds) {
      id
      name
      icon_url
      created_at
    }
  }
`;