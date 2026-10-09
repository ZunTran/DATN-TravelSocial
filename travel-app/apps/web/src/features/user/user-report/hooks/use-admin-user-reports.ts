'use client';

import { useQuery } from '@apollo/client/react';

import { ADMIN_USER_REPORTS } from '../api/user-report.queries';

import type {
  AdminUserReportsResponse,
  UserReportStatus,
} from '../types/user-report.types';

interface AdminUserReportsVariables {
  input: {
    page: number;
    limit: number;
    status?: UserReportStatus;
  };
}

interface UseAdminUserReportsParams {
  page?: number;
  limit?: number;
  status?: UserReportStatus;
}

export function useAdminUserReports({
  page = 1,
  limit = 10,
  status,
}: UseAdminUserReportsParams = {}) {
  const { data, loading, error, refetch } = useQuery<
    AdminUserReportsResponse,
    AdminUserReportsVariables
  >(ADMIN_USER_REPORTS, {
    variables: {
      input: {
        page,
        limit,
        ...(status ? { status } : {}),
      },
    },

    fetchPolicy: 'cache-and-network',
  });

  return {
    reports: data?.adminUserReports?.data ?? [],

    pagination: data?.adminUserReports
      ? {
          total: data.adminUserReports.total,
          page: data.adminUserReports.page,
          limit: data.adminUserReports.limit,
          totalPages: data.adminUserReports.totalPages,
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