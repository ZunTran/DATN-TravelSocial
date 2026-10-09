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
  profileId?: string,
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
  profileId: profileId ?? "",
},
      skip: !profileId,
    },
  );

const [
    followMutation,
    { loading: following },
  ] = useMutation<
    FollowData,
    { profileId: string }
  >(FOLLOW_MUTATION);

  const [
    unfollowMutation,
    { loading: unfollowing },
  ] = useMutation<
    UnfollowData,
    { profileId: string }
  >(UNFOLLOW_MUTATION);
  
  const isFollowing =
    data?.isFollowing ?? false;

  const toggleFollow = async () => {
   
    if (!profileId) {
      return;
    }

    if (isFollowing) {
      await unfollowMutation({
        variables: {
          profileId,
        },
      });
    } else {
      await followMutation({
        variables: {
          profileId,
        },
      });
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