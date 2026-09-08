'use client';

import { useQuery } from '@apollo/client/react';
import { FOLLOW_STATS_QUERY } from '../api/follow.queries';

interface FollowStatsData {
  followersCount: number;
  followingCount: number;
}

interface FollowStatsVariables {
  profileId: string;
}

export function useFollowCounts( profileId: string, options?: { skip?: boolean; }) {
  const skip = options?.skip ?? !profileId;
  const {
    data: followersData,
    loading,
    error,
    refetch
  } = useQuery<
    FollowStatsData,
    FollowStatsVariables
  >(
    FOLLOW_STATS_QUERY,
    {
      variables: { profileId },
      skip,
      fetchPolicy: 'cache-and-network',
    },
  );

  return {
    followerCount: followersData?.followersCount ?? 0,
    followingCount: followersData?.followingCount ?? 0,

    loading,
    error,
    refetch,
  };
}