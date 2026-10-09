"use client";
import { useQuery } from "@apollo/client/react";
import { GET_SAVED_POSTS } from "../api/saved.queries";
import type { Post } from "../types/post.types";

interface SavedPostsQuery {
  savedPosts: {
    items: Post[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
  };
}

export function useSavedPosts(profileId?: string) {
  const { data, loading, error, refetch } =
    useQuery<SavedPostsQuery>(GET_SAVED_POSTS, {
      variables: profileId
        ? {
            profileId,
            pagination: {
              page: 1,
              limit: 20,
            },
          }
        : undefined,

      skip: !profileId,

      fetchPolicy: "network-only",
    });

  return {
    posts: data?.savedPosts?.items ?? [],
    total: data?.savedPosts?.total ?? 0,
    page: data?.savedPosts?.page ?? 1,
    limit: data?.savedPosts?.limit ?? 20,
    totalPages: data?.savedPosts?.totalPages ?? 0,
    hasNextPage: data?.savedPosts?.hasNextPage ?? false,
    loading,
    error,
    refetch,
  };
}