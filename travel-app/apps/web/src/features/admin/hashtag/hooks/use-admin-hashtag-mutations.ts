'use client';

import {
  useMutation,
} from '@apollo/client/react';



import type {
  CreateHashtagInput,
  UpdateHashtagInput,
} from '../types/hashtag.types';
import { CREATE_ADMIN_HASHTAG, DELETE_ADMIN_HASHTAG, UPDATE_ADMIN_HASHTAG } from '../api/hashtag.queries';

export function useAdminHashtagMutations() {
  const [
    createHashtag,
    {
      loading: creating,
    },
  ] = useMutation(
    CREATE_ADMIN_HASHTAG,
  );

  const [
    updateHashtag,
    {
      loading: updating,
    },
  ] = useMutation(
    UPDATE_ADMIN_HASHTAG,
  );

  const [
    deleteHashtag,
    {
      loading: deleting,
    },
  ] = useMutation(
    DELETE_ADMIN_HASHTAG,
  );

  return {
    createHashtag: (
      input: CreateHashtagInput,
    ) =>
      createHashtag({
        variables: {
          input,
        },
      }),

    updateHashtag: (
      input: UpdateHashtagInput,
    ) =>
      updateHashtag({
        variables: {
          input,
        },
      }),

    deleteHashtag: (
      id: string,
    ) =>
      deleteHashtag({
        variables: {
          id,
        },
      }),

    creating,
    updating,
    deleting,
    loading:
      creating ||
      updating ||
      deleting,
  };
}