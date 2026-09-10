'use client';

import {useQuery} from '@apollo/client/react';
import {GET_ADMIN_HASHTAGS} from '../api/hashtag.queries';
import type { AdminHashtagFilter, AdminHashtagList} from '../types/hashtag.types';

interface QueryData {
  adminHashtags: AdminHashtagList;
}

interface QueryVariables {
  filter: AdminHashtagFilter;
}

export function useAdminHashtags(
  filter: AdminHashtagFilter,
) {
  const {
    data,
    loading,
    error,
    refetch,
  } = useQuery<
    QueryData,
    QueryVariables
  >(
    GET_ADMIN_HASHTAGS,
    {
      variables: {
        filter,
      },
      fetchPolicy: 'network-only',
    },
  );

  return {
    data: data?.adminHashtags ?? {
      items: [],
      total: 0,
      page: filter.page,
      limit: filter.limit,
      totalPages: 0,
    },

    loading,
    error,
    refetch,
  };
}