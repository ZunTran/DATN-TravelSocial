'use client';

import { useQuery } from '@apollo/client/react';

import { GET_MY_INTERESTS } from '../api/interest.queries';

import { useAuthContext } from '@/features/auth/context/auth-context';

import type { GetMyInterestsData } from '../types/interest';

export function useMyInterests() {
  const {
    isLoading: authLoading,
    isAuthenticated,
  } = useAuthContext();

  const {
    data,
    loading,
    error,
    refetch,
  } = useQuery<GetMyInterestsData>(
    GET_MY_INTERESTS,
    {
      skip:
        authLoading ||
        !isAuthenticated,
    },
  );

  return {
    interests:
      data?.getMyInterests ?? [],

    loading:
      authLoading || loading,

    error,

    refetch,
  };
}