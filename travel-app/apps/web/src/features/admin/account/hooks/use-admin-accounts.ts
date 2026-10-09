'use client';

import { useEffect, useState } from 'react';
import { useLazyQuery } from '@apollo/client/react';

import { ADMIN_ACCOUNTS_QUERY } from '../api/admin-account.queries';
import type {
  AdminAccountsQuery,
} from '../types/admin-account.types';

interface UseAdminAccountsOptions {
  search?: string;
  page?: number;
  limit?: number;
  enabled?: boolean;
}

export function useAdminAccounts({
  search = '',
  page = 1,
  limit = 10,
  enabled = false,
}: UseAdminAccountsOptions = {}) {
  const [debouncedSearch, setDebouncedSearch] =
    useState(search);


  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 350);

    return () => {
      clearTimeout(timer);
    };
  }, [search]);

  const [
    fetchAdminAccounts,
    {
      data,
      loading,
      error,
    },
  ] = useLazyQuery<AdminAccountsQuery>(
    ADMIN_ACCOUNTS_QUERY,
    {
      fetchPolicy: 'network-only',
      notifyOnNetworkStatusChange: true,
    },
  );

  useEffect(() => {
    if (!enabled) return;
    

    const variables = {
      filter: {
        search: debouncedSearch.trim() || undefined,
        page,
        limit,
      },
    };

    console.log( '[AdminAccounts] CALL API:', variables);

    fetchAdminAccounts({
      variables,
    });
  }, [
    enabled,
    page,
    limit,
    debouncedSearch,
    fetchAdminAccounts,
  ]);

  const pagination = data?.adminAccounts ?? {
    items: [],
    total: 0,
    page,
    limit,
    totalPages: 0,
  };

  console.log('[AdminAccounts] STATE:',
    {
      page,
      responsePage: pagination.page,
      loading,
    },
  );

  return {
    accounts: pagination.items,
    pagination,
    loading,
    error,
  };
}