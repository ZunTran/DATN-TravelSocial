'use client';

import {
  useQuery,
} from '@apollo/client/react';

import {
  SEARCH_POSTS_QUERY,
} from '../api/explore-posts.queries';

import type {
  SearchPostsResponse,
} from '../types/explore.types';

export function useSearchPosts(
  keyword: string,
  page = 1,
  limit = 20,
) {
  const trimmedKeyword = keyword.trim();

  const {
    data,
    loading,
    error,
    refetch,
  } = useQuery<
    SearchPostsResponse,
    {
      keyword: string;
      page: number;
      limit: number;
    }
  >(
    SEARCH_POSTS_QUERY,
    {
      variables: {
        keyword: trimmedKeyword,
        page,
        limit,
      },
      skip: !trimmedKeyword,
      fetchPolicy: 'cache-and-network',
    },
  );

  return {
    posts: data?.searchPosts.items ?? [],
    total: data?.searchPosts.total ?? 0,
    page: data?.searchPosts.page ?? page,
    limit: data?.searchPosts.limit ?? limit,
    totalPages: data?.searchPosts.totalPages ?? 0,
    loading,
    error,
    refetch,
  };
}