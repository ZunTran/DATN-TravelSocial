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

export const FOLLOWERS_COUNT_QUERY = gql`
  query FollowersCount($profileId: ID!) {
    followersCount(profileId: $profileId)
  }
`;

export const FOLLOWING_COUNT_QUERY = gql`
  query FollowingCount($profileId: ID!) {
    followingCount(profileId: $profileId)
  }
`;