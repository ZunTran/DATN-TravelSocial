'use client';

import { useQuery } from '@apollo/client/react';

import {
  ADMIN_USER_DASHBOARD_QUERY,
} from '../api/admin-dashboard.queries';

import type {
  AdminUserDashboardQuery,
  DashboardDays,
} from '../types/admin-dashboard.types';

interface UseAdminDashboardOptions {
  days?: DashboardDays;
}

export function useAdminDashboard({
  days = 30,
}: UseAdminDashboardOptions = {}) {
  const {
    data,
    loading,
    error,
    refetch,
    previousData,
  } = useQuery<AdminUserDashboardQuery>(
    ADMIN_USER_DASHBOARD_QUERY,
    {
      variables: { days },
      fetchPolicy: 'cache-and-network',
      nextFetchPolicy: 'cache-first',
      notifyOnNetworkStatusChange: true,
    },
  );

  const dashboard = data?.adminUserDashboard ?? previousData?.adminUserDashboard ??  null;

  return {
    dashboard,
    loading,
    error,
    refetch,
  };
}