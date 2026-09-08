import { gql } from "@apollo/client";

export const FOLLOW_MUTATION = gql`
  mutation Follow($profileId: ID!) {
    follow(profileId: $profileId) {
      follower_id
      following_id
      created_at
    }
  }
`;

export const UNFOLLOW_MUTATION = gql`
  mutation Unfollow($profileId: ID!) {
    unfollow(profileId: $profileId)
  }
`;

export const IS_FOLLOWING_QUERY = gql`
  query IsFollowing($profileId: ID!) {
    isFollowing(profileId: $profileId)
  }
`;


export const FOLLOW_STATS_QUERY = gql`
  query FollowStats($profileId: ID!) {
    followersCount(profileId: $profileId)
    followingCount(profileId: $profileId)
  }
`;

export const FOLLOWERS_QUERY = gql`
  query Followers(
    $profileId: ID! 
    $input: GatewayPaginationInput!
  ) {
    followers( 
      profileId: $profileId
      input: $input
      ) {
        data {
          id
          username
          display_name
          avatar_url
        }
        total
        page
        limit
        totalPages
      }
    }
  `;

export const FOLLOWING_QUERY = gql`
  query Following(
    $profileId: ID!
    $input: GatewayPaginationInput!) {
  following(
    profileId: $profileId
    input: $input) {
        data {
          id
          username
          display_name
          avatar_url
        }
        total
        page
        limit
        totalPages
      }
    }
  `;