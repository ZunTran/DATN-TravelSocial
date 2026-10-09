
'use client';
import { useQuery } from '@apollo/client/react';
import { GET_SUGGESTED_USERS_BY_INTERESTS } from '../api/user.queries';
import { RecommendedUser } from '../types/recommendation';

interface SuggestedUsersResponse {
  getSuggestedUsersByInterests: RecommendedUser[];
}

export function useSuggestedUsers() {
  const {
    data,
    loading,
    error,
    refetch,
  } = useQuery<SuggestedUsersResponse>(
    GET_SUGGESTED_USERS_BY_INTERESTS,
    {fetchPolicy: 'cache-and-network'},
  );

  return {
    users:
      data?.getSuggestedUsersByInterests ?? [],
    loading,
    error,
    refetch,
  };
}

