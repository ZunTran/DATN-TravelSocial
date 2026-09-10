'use client';

import {
  useEffect,
  useState,
} from 'react';

import {
  useMutation,
  useQuery,
} from '@apollo/client/react';

import {
  ADMIN_CATEGORIES_QUERY,
  CREATE_CATEGORY_MUTATION,
  DELETE_CATEGORY_MUTATION,
  UPDATE_CATEGORY_MUTATION,
} from '../api/category.queries';

import type {
  AdminCategory,
  AdminCategoryPage,
} from '../types/category.types';

interface QueryData {
  categoryOptions: AdminCategoryPage;
}

interface QueryVariables {
  filter: {
    search?: string;
    page: number;
    limit: number;
  };
}

interface CreateResponse {
  createCategory: AdminCategory;
}

interface UpdateResponse {
  updateCategory: AdminCategory;
}

interface DeleteResponse {
  deleteCategory: boolean;
}

export function useAdminCategories({
  search = '',
  page = 1,
  limit = 10,
}: {
  search?: string;
  page?: number;
  limit?: number;
}) {
  const [
    debouncedSearch,
    setDebouncedSearch,
  ] = useState(search);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(
        search.trim(),
      );
    }, 700);

    return () =>
      clearTimeout(timer);
  }, [search]);

  const {
    data,
    loading,
    error,
    refetch,
  } = useQuery<
    QueryData,
    QueryVariables
  >(
    ADMIN_CATEGORIES_QUERY,
    {
      variables: {
        filter: {
          page,
          limit,
          search:
            debouncedSearch ||
            undefined,
        },
      },
      fetchPolicy:
        'cache-and-network',
      notifyOnNetworkStatusChange:
        true,
    },
  );

const result = data?.categoryOptions;

  return {
    categories:
      result?.items ?? [],

    total:
      result?.total ?? 0,

    page:
      result?.page ?? page,

    limit:
      result?.limit ?? limit,

    totalPages:
      result?.totalPages ?? 0,

    loading,
    error,
    refetch,
  };
}

export function useAdminCategoryMutations() {
  const [
    createCategoryMutation,
    createState,
  ] = useMutation<CreateResponse>(
    CREATE_CATEGORY_MUTATION,
  );

  const [
    updateCategoryMutation,
    updateState,
  ] = useMutation<UpdateResponse>(
    UPDATE_CATEGORY_MUTATION,
  );

  const [
    deleteCategoryMutation,
    deleteState,
  ] = useMutation<DeleteResponse>(
    DELETE_CATEGORY_MUTATION,
  );

  const createCategory = async (
    name: string,
    description?: string,
  ) => {
    const result =
      await createCategoryMutation({
        variables: {
          input: {
            name,
            description,
          },
        },
      });

    return result.data
      ?.createCategory;
  };

  const updateCategory = async (
    id: string,
    name: string,
    description?: string,
  ) => {
    const result =
      await updateCategoryMutation({
        variables: {
          input: {
            id,
            name,
            description,
          },
        },
      });

    return result.data
      ?.updateCategory;
  };

  const deleteCategory = async (
    id: string,
  ) => {
    const result =
      await deleteCategoryMutation({
        variables: {
          id,
        },
      });

    return (
      result.data
        ?.deleteCategory ?? false
    );
  };

  return {
    createCategory,
    updateCategory,
    deleteCategory,

    creating:
      createState.loading,

    updating:
      updateState.loading,

    deleting:
      deleteState.loading,
  };
}