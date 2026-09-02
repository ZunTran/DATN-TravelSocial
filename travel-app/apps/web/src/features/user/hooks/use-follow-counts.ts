'use client';

import { useQuery } from '@apollo/client/react';
import { FOLLOWERS_COUNT_QUERY, FOLLOWING_COUNT_QUERY } from '../api/follow.queries';

interface FollowersCountData {
  followersCount: number;
}

interface FollowingCountData {
  followingCount: number;
}

interface FollowCountVariables {
  profileId: string;
}

export function useFollowCounts( profileId: string, options?: { skip?: boolean; }) {
  const skip = options?.skip ?? !profileId;

  const {
    data: followersData,
    loading: followersLoading,
    error: followersError,
    refetch: refetchFollowersCount,
  } = useQuery<
    FollowersCountData,
    FollowCountVariables
  >(
    FOLLOWERS_COUNT_QUERY,
    {
      variables: { profileId },
      skip,
      fetchPolicy: 'cache-and-network',
    },
  );

  const {
    data: followingData,
    loading: followingLoading,
    error: followingError,
    refetch: refetchFollowingCount,
  } = useQuery<
    FollowingCountData,
    FollowCountVariables
  >(
    FOLLOWING_COUNT_QUERY,
    {
      variables: {
        profileId,
      },
      skip,
      fetchPolicy: 'cache-and-network',
    },
  );

  return {
    followerCount: followersData?.followersCount ?? 0,
    followingCount: followingData?.followingCount ?? 0,
    loading: followersLoading || followingLoading,

    followersError,
    followingError,

    refetchFollowersCount,
    refetchFollowingCount,
  };
}