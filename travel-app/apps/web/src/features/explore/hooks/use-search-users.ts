'use client';

import {
  useQuery,
} from '@apollo/client/react';

import {
  SEARCH_USERS_QUERY,
} from '../api/explore-users.queries';

import type {
  SearchUsersResponse,
} from '../types/explore.types';

interface SearchUsersVariables {
  input: {
    keyword?: string;
    page: number;
    limit: number;
  };
}

export function useSearchUsers(
  keyword: string,
  page = 1,
  limit = 10,
) {
  const trimmedKeyword = keyword.trim();

  const {
    data,
    loading,
    error,
    refetch,
  } = useQuery<
    SearchUsersResponse,
    SearchUsersVariables
  >(
    SEARCH_USERS_QUERY,
    {
      variables: {
        input: {
          keyword: trimmedKeyword,
          page,
          limit,
        },
      },
      skip: !trimmedKeyword,
      fetchPolicy: 'cache-and-network',
    },
  );

  return {
    users: data?.searchUsers.data ?? [],
    total: data?.searchUsers.total ?? 0,
    page: data?.searchUsers.page ?? page,
    limit: data?.searchUsers.limit ?? limit,
    totalPages: data?.searchUsers.totalPages ?? 0,
    loading,
    error,
    refetch,
  };
}