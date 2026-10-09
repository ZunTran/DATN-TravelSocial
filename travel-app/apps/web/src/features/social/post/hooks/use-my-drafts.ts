'use client';

import { useQuery } from '@apollo/client/react';

import { MY_DRAFTS_QUERY } from '../api/post.queries';

import type {
  MyDraftPostsResponse,
} from '../types/post.types';

interface MyDraftPostsVariables {
  page: number;
  limit: number;
}

export function useMyDraftPosts(
  page = 1,
  limit = 5,
  enabled = false,
) {
  const {
    data,
    loading,
    error,
    refetch,
  } = useQuery<
    MyDraftPostsResponse,
    MyDraftPostsVariables
  >(MY_DRAFTS_QUERY, {
    variables: {
      page,
      limit,
    },

    skip: !enabled,

    fetchPolicy: 'cache-and-network',
  });

  return {
    posts:
      data?.myDraftPosts.items ?? [],

    pagination:
      data?.myDraftPosts ?? null,

    loading,
    error,
    refetch,
  };
}