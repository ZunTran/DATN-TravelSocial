"use client";

import {
  useMutation,
  useQuery,
} from "@apollo/client/react";

import {
  FOLLOW_MUTATION,
  UNFOLLOW_MUTATION,
  IS_FOLLOWING_QUERY,
} from "../api/follow.queries";

import type {
  FollowData,
  UnfollowData,
  IsFollowingData,
} from "../types/follow";

export function useFollow(
  profileId: string,
) {
  const {
    data,
    loading: checking,
    refetch,
  } = useQuery<
    IsFollowingData,
    { profileId: string }
  >(
    IS_FOLLOWING_QUERY,
    {
      variables: {
        profileId,
      },
      skip: !profileId,
    },
  );

  const [
    followMutation,
    {
      loading: following,
    },
  ] = useMutation<
    FollowData,
    { profileId: string }
  >(
    FOLLOW_MUTATION,
    {
      variables: {
        profileId,
      },
      refetchQueries: [
        {
          query: IS_FOLLOWING_QUERY,
          variables: {
            profileId,
          },
        },
      ],
    },
  );

  const [
    unfollowMutation,
    {
      loading: unfollowing,
    },
  ] = useMutation<
    UnfollowData,
    { profileId: string }
  >(
    UNFOLLOW_MUTATION,
    {
      variables: {
        profileId,
      },
      refetchQueries: [
        {
          query: IS_FOLLOWING_QUERY,
          variables: {
            profileId,
          },
        },
      ],
    },
  );

  const isFollowing =
    data?.isFollowing ?? false;

  const toggleFollow = async () => {
    if (isFollowing) {
      await unfollowMutation();
    } else {
      await followMutation();
    }

    await refetch();
  };

  return {
    isFollowing,

    toggleFollow,

    loading:
      checking ||
      following ||
      unfollowing,
  };
}