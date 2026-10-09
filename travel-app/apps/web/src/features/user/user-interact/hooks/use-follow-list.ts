'use client';

import { useEffect,  useState} from 'react';
import { useLazyQuery } from '@apollo/client/react';
import { FOLLOWERS_QUERY, FOLLOWING_QUERY} from '../api/follow.queries';
import type { FollowersData,  FollowingData, FollowUser} from '../types/follow';
const PAGE_SIZE = 20;

interface FollowVariables {
  profileId: string;
  input: {
    page: number;
    limit: number;
  };
}

export function useFollowList(profileId?: string) {
  const [
    loadFollowers,
    {
      loading: followersQueryLoading,
    },
  ] = useLazyQuery<
    FollowersData,
    FollowVariables
  >(FOLLOWERS_QUERY, {
    fetchPolicy: 'network-only',
  });

  const [
    loadFollowing,
    {
      loading: followingQueryLoading,
    },
  ] = useLazyQuery<
    FollowingData,
    FollowVariables
  >(FOLLOWING_QUERY, {
    fetchPolicy: 'network-only',
  });


  const [followers, setFollowers] = useState<FollowUser[]>([]);
  const [following, setFollowing] = useState<FollowUser[]>([]);

  const [followersPage, setFollowersPage] = useState(0);
  const [followingPage, setFollowingPage] = useState(0);

  const [followersTotalPages, setFollowersTotalPages] = useState(0);
  const [followingTotalPages, setFollowingTotalPages] = useState(0);
  const [followersLoaded, setFollowersLoaded] = useState(false);
  const [followingLoaded, setFollowingLoaded] = useState(false);

  const [
    followersInitialLoading,
    setFollowersInitialLoading,
  ] = useState(false);

  const [
    followingInitialLoading,
    setFollowingInitialLoading,
  ] = useState(false);

  const [
    followersLoadingMore,
    setFollowersLoadingMore,
  ] = useState(false);

  const [
    followingLoadingMore,
    setFollowingLoadingMore,
  ] = useState(false);

  useEffect(() => {
    setFollowers([]);
    setFollowing([]);

    setFollowersPage(0);
    setFollowingPage(0);

    setFollowersTotalPages(0);
    setFollowingTotalPages(0);

    setFollowersLoaded(false);
    setFollowingLoaded(false);

    setFollowersInitialLoading(false);
    setFollowingInitialLoading(false);

    setFollowersLoadingMore(false);
    setFollowingLoadingMore(false);
  }, [profileId]);

  const loadFollowersFirstPage = async () => {
    if (
      !profileId ||
      followersLoaded ||
      followersInitialLoading ||
      followersLoadingMore
    ) {
      return;
    }

    setFollowersInitialLoading(true);

    try {
      const result = await loadFollowers({
        variables: {
          profileId,
          input: {
            page: 1,
            limit: PAGE_SIZE,
          },
        },
      });

      const page = result.data?.followers;

      if (!page) {
        return;
      }

      setFollowers(page.data);
      setFollowersPage(page.page);
      setFollowersTotalPages(page.totalPages);

      setFollowersLoaded(true);
    } catch (error) {
      console.error(
        'Failed to load followers:',
        error,
      );
    } finally {
      setFollowersInitialLoading(false);
    }
  };


  const loadFollowingFirstPage = async () => {
    if (
      !profileId ||
      followingLoaded ||
      followingInitialLoading ||
      followingLoadingMore
    ) {
      return;
    }

    setFollowingInitialLoading(true);

    try {
      const result = await loadFollowing({
        variables: {
          profileId,
          input: {
            page: 1,
            limit: PAGE_SIZE,
          },
        },
      });

      const page = result.data?.following;

      if (!page) {
        return;
      }

      setFollowing(page.data);
      setFollowingPage(page.page);
      setFollowingTotalPages(
        page.totalPages,
      );

      setFollowingLoaded(true);
    } catch (error) {
      console.error(
        'Failed to load following:',
        error,
      );
    } finally {
      setFollowingInitialLoading(false);
    }
  };


  const loadMoreFollowers = async () => {
    if (
      !profileId ||
      followersQueryLoading ||
      followersLoadingMore ||
      !followersLoaded ||
      followersPage >= followersTotalPages
    ) {
      return;
    }

    const nextPage =
      followersPage + 1;

    setFollowersLoadingMore(true);

    try {
      const result = await loadFollowers({
        variables: {
          profileId,
          input: {
            page: nextPage,
            limit: PAGE_SIZE,
          },
        },
      });

      const page = result.data?.followers;

      if (!page) {
        return;
      }

      setFollowers((current) => [
        ...current,
        ...page.data,
      ]);

      setFollowersPage(page.page);

      setFollowersTotalPages(
        page.totalPages,
      );
    } catch (error) {
      console.error(
        'Failed to load more followers:',
        error,
      );
    } finally {
      setFollowersLoadingMore(false);
    }
  };


  const loadMoreFollowing = async () => {
    if (
      !profileId ||
      followingQueryLoading ||
      followingLoadingMore ||
      !followingLoaded ||
      followingPage >= followingTotalPages
    ) {
      return;
    }

    const nextPage =
      followingPage + 1;

    setFollowingLoadingMore(true);

    try {
      const result = await loadFollowing({
        variables: {
          profileId,
          input: {
            page: nextPage,
            limit: PAGE_SIZE,
          },
        },
      });

      const page = result.data?.following;

      if (!page) {
        return;
      }

      setFollowing((current) => [
        ...current,
        ...page.data,
      ]);

      setFollowingPage(page.page);

      setFollowingTotalPages(
        page.totalPages,
      );
    } catch (error) {
      console.error(
        'Failed to load more following:',
        error,
      );
    } finally {
      setFollowingLoadingMore(false);
    }
  };


  return {
    followers,
    following,
    followersLoading: followersInitialLoading,
    followingLoading: followingInitialLoading,

    followersLoadingMore,
    followingLoadingMore,
    followersHasMore: followersPage < followersTotalPages,
    followingHasMore: followingPage < followingTotalPages,

    loadFollowersFirstPage,
    loadFollowingFirstPage,

    loadMoreFollowers,
    loadMoreFollowing,
  };
}