import { gql } from "@apollo/client";

export const IS_BLOCKED_QUERY = gql`
  query IsBlocked($profileId: ID!) {
    isBlocked(profileId: $profileId)
  }
`;

export const UNBLOCK_MUTATION = gql`
  mutation Unblock($profileId: ID!) {
    unblock(profileId: $profileId)
  }
`;