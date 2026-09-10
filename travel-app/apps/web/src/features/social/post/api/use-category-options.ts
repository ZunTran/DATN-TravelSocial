'use client';

import {
  useQuery,
} from '@apollo/client/react';

import { CATEGORY_OPTIONS_QUERY } from '../api/category-options.queries';

interface Category {
  id: string;
  name: string;
  description?: string | null;
}

interface CategoryPage {
  items: Category[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
}

interface QueryData {
  categoryOptions: CategoryPage;
}

export function useCategoryOptions(
  search?: string,
) {
  const {
    data,
    loading,
    fetchMore,
    refetch,
  } = useQuery<QueryData>(
    CATEGORY_OPTIONS_QUERY,
    {
      variables: {
        filter: {
          search: search || undefined,
          page: 1,
          limit: 20,
        },
      },

      fetchPolicy: 'cache-and-network',
    },
  );

  const page =
    data?.categoryOptions;

  const loadMore =
    async () => {
      if (
        loading ||
        !page?.hasNextPage
      ) {
        return;
      }

      await fetchMore({
        variables: {
          filter: {
            search:
              search || undefined,
            page:
              page.page + 1,
            limit: 20,
          },
        },

        updateQuery: (
          previous,
          { fetchMoreResult },
        ) => {
          if (
            !fetchMoreResult
          ) {
            return previous;
          }

          return {
            categoryOptions: {
              ...fetchMoreResult.categoryOptions,

              items: [
                ...previous.categoryOptions
                  .items,

                ...fetchMoreResult
                  .categoryOptions
                  .items,
              ],
            },
          };
        },
      });
    };

  return {
    categories:
      page?.items ?? [],

    loading,

    hasNextPage:
      page?.hasNextPage ?? false,

    loadMore,

    refetch,
  };
}