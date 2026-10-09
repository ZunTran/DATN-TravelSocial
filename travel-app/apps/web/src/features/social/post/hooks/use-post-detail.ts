'use client';

import { useQuery } from '@apollo/client/react';

import { GET_POST_DETAIL } from '../api/post.queries';
import type { Post } from '../types/post.types';

import {
  useAuthContext,
} from '@/features/auth/context/auth-context';

interface GetPostDetailResponse {
  post: Post;
}

interface GetPostDetailVariables {
  postId: string;
}

export function usePostDetail(
  postId: string,
) {
  const {
    isLoading: authLoading,
    isAuthenticated,
  } = useAuthContext();

  const {
    data,
    loading,
    error,
    refetch,
  } = useQuery<
    GetPostDetailResponse,
    GetPostDetailVariables
  >(
    GET_POST_DETAIL,
    {
      variables: {
        postId,
      },

      skip:
        !postId ||
        authLoading ||
        !isAuthenticated,

      fetchPolicy: 'cache-and-network',

      notifyOnNetworkStatusChange: true,
    },
  );

  return {
    post: data?.post ?? null,

    postLoading:
      authLoading || loading,

    postError:
      error,

    refetchPost:
      refetch,

    isAuthenticated,
    authLoading,
  };
}