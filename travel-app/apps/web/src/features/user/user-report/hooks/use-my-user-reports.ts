'use client';

import { useQuery } from '@apollo/client/react';

import { MY_USER_REPORTS } from '../api/user-report.queries';

import type {
  MyUserReportsResponse,
} from '../types/user-report.types';

interface MyUserReportsVariables {
  input: {
    page: number;
    limit: number;
  };
}

export function useMyUserReports(
  page = 1,
  limit = 10,
) {
  const { data, loading, error, refetch } = useQuery<
    MyUserReportsResponse,
    MyUserReportsVariables
  >(MY_USER_REPORTS, {
    variables: {
      input: {
        page,
        limit,
      },
    },

    fetchPolicy: 'cache-and-network',
  });

  return {
    reports: data?.myUserReports?.data ?? [],

    pagination: data?.myUserReports
      ? {
          total: data.myUserReports.total,
          page: data.myUserReports.page,
          limit: data.myUserReports.limit,
          totalPages: data.myUserReports.totalPages,
        }
      : {
          total: 0,
          page,
          limit,
          totalPages: 0,
        },

    loading,
    error,
    refetch,
  };
}