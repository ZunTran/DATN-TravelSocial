"use client";

import { useCallback, useState } from "react";import { useQuery } from "@apollo/client/react";
import { GET_FEED } from "../api/feed.queries";
import type { FeedResponse } from "../types/feed.types";
import { useAuthContext } from "@/features/auth/context/auth-context";
import { Post } from "../post/types/post.types";
const FEED_LIMIT = 5;

export function useFeed() {
  const {
    accessToken,
    isAuthenticated,
    isLoading: authLoading,
  } = useAuthContext();

  const [loadingMore, setLoadingMore] = useState(false);

const prependPost = useCallback((post: Post) => {
}, []);

  const shouldSkip =
    authLoading || !isAuthenticated || !accessToken;

  const {
    data,
    loading,
    error,
    fetchMore,
    refetch,
  } = useQuery<FeedResponse>(
    GET_FEED,
    {
      variables: {
        input: {
          cursor: null,
          limit: FEED_LIMIT,
        },
      },

      skip: shouldSkip,
      fetchPolicy: "cache-and-network",
      nextFetchPolicy: "cache-first",
      notifyOnNetworkStatusChange: true,
    },
  );

  const posts =
    data?.feed?.items ?? [];

  const hasNextPage =
    data?.feed?.hasNextPage ?? false;

  const endCursor =
    data?.feed?.endCursor ?? null;

  const loadMore = async () => {
    if (
      loadingMore ||
      !hasNextPage ||
      !endCursor
    ) {
      return;
    }

    try {
      setLoadingMore(true);

      await fetchMore({
        variables: {
          input: {
            cursor: endCursor,
            limit: FEED_LIMIT,
          },
        },

        updateQuery: (
          previous,
          { fetchMoreResult },
        ) => {
          if (!fetchMoreResult) {
            return previous;
          }

          const previousItems =
            previous.feed.items;

          const nextItems =
            fetchMoreResult.feed.items;

          const existingIds =
            new Set(
              previousItems.map(
                (post) => post.id,
              ),
            );

          const uniqueNextItems =
            nextItems.filter(
              (post) =>
                !existingIds.has(
                  post.id,
                ),
            );

          return {
            feed: {
              ...fetchMoreResult.feed,

              items: [
                ...previousItems,
                ...uniqueNextItems,
              ],
            },
          };
        },
      });
    } finally {
      setLoadingMore(false);
    }
  };

  return {
    posts,

    hasNextPage,

    endCursor,

    loading:
      authLoading || loading,

    loadingMore,

    error,

    loadMore,

    refetch,
  };
}