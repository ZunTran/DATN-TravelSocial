'use client';

import {
  useMutation,
  useQuery,
} from '@apollo/client/react';

import {
  GET_ADMIN_INTERESTS,
  CREATE_ADMIN_INTEREST,
  UPDATE_ADMIN_INTEREST,
  DELETE_ADMIN_INTEREST,
} from '../api/interest.queries';

import type {
  AdminInterestPage,
} from '../types/interest.types';

interface GetAdminInterestsData {
  getInterestTagsPaginated:
    AdminInterestPage;
}

interface GetAdminInterestsVariables {
  input: {
    page: number;
    limit: number;
    search?: string;
  };
}

interface CreateInterestData {
  createInterestTag: {
    id: string;
    name: string;
    icon_url?: string | null;
    created_at: string;
  };
}

interface CreateInterestVariables {
  input: {
    name: string;
  };
  icon?: File | null;
}

interface UpdateInterestData {
  updateInterestTag: {
    id: string;
    name: string;
    icon_url?: string | null;
    created_at: string;
  };
}

interface UpdateInterestVariables {
  id: string;

  input: {
    name?: string;
  };

  icon?: File | null;
}

interface DeleteInterestData {
  deleteInterestTag: boolean;
}

interface DeleteInterestVariables {
  id: string;
}

export function useAdminInterests(
  page: number,
  search: string,
) {
  const {
    data,
    loading,
    error,
    refetch,
  } = useQuery<
    GetAdminInterestsData,
    GetAdminInterestsVariables
  >(
    GET_ADMIN_INTERESTS,
    {
      variables: {
        input: {
          page,
          limit: 20,
          search:
            search.trim() || undefined,
        },
      },

      fetchPolicy:
        'network-only',
    },
  );

  const [
    createMutation,
    {
      loading:
        createLoading,
    },
  ] =
    useMutation<
      CreateInterestData,
      CreateInterestVariables
    >(
      CREATE_ADMIN_INTEREST,
    );

  const [
    updateMutation,
    {
      loading:
        updateLoading,
    },
  ] =
    useMutation<
      UpdateInterestData,
      UpdateInterestVariables
    >(
      UPDATE_ADMIN_INTEREST,
    );

  const [
    deleteMutation,
    {
      loading:
        deleteLoading,
    },
  ] =
    useMutation<
      DeleteInterestData,
      DeleteInterestVariables
    >(
      DELETE_ADMIN_INTEREST,
    );

  const createInterest = async (
    name: string,
    icon?: File | null,
  ) => {
    const result =
      await createMutation({
        variables: {
          input: {
            name,
          },
          icon,
        },
      });

    await refetch();

    return result.data
      ?.createInterestTag;
  };

  const updateInterest = async (
    id: string,
    name: string,
    icon?: File | null,
  ) => {
    const result =
      await updateMutation({
        variables: {
          id,
          input: {
            name,
          },
          icon,
        },
      });

    await refetch();

    return result.data
      ?.updateInterestTag;
  };

  const deleteInterest = async (
    id: string,
  ) => {
    const result =
      await deleteMutation({
        variables: {
          id,
        },
      });

    await refetch();

    return result.data
      ?.deleteInterestTag;
  };

  return {
    interests:
      data
        ?.getInterestTagsPaginated
        .data ?? [],

    pagination:
      data
        ?.getInterestTagsPaginated ?? {
          data: [],
          total: 0,
          page,
          limit: 20,
          totalPages: 0,
        },

    loading,
    error,

    createInterest,
    updateInterest,
    deleteInterest,

    createLoading,
    updateLoading,
    deleteLoading,

    refetch,
  };
}