'use client';

import { useQuery } from '@apollo/client/react';

import { ADMIN_USER_REPORT } from '../api/user-report.queries';

import type {
  AdminUserReportResponse,
} from '../types/user-report.types';

interface AdminUserReportVariables {
  id: string;
}

export function useAdminUserReport(
  id?: string,
) {
  const { data, loading, error, refetch } = useQuery<
    AdminUserReportResponse,
    AdminUserReportVariables
  >(ADMIN_USER_REPORT, {
    variables: {
      id: id ?? '',
    },

    skip: !id,

    fetchPolicy: 'cache-and-network',
  });

  return {
    report: data?.adminUserReport ?? null,
    loading,
    error,
    refetch,
  };
}