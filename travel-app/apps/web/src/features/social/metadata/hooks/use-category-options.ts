'use client';

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import { useLazyQuery } from '@apollo/client/react';
import { CATEGORY_OPTIONS_QUERY } from '../api/category.queries';
import type { CategoryPage } from '../types/category.types';

interface CategoryOptionsResponse {
  categoryOptions: CategoryPage;
}

interface CategoryOptionsVariables {
  filter: {
    search?: string;
    page: number;
    limit: number;
  };
}

export function useCategoryOptions() {
  const [opened, setOpened] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<CategoryPage['items']>([]);
  const [hasNextPage, setHasNextPage] = useState(false);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [
    loadCategories,
    {
      loading,
      error,
    },
  ] = useLazyQuery<
    CategoryOptionsResponse,
    CategoryOptionsVariables
  >(CATEGORY_OPTIONS_QUERY, {
    fetchPolicy: 'network-only',
  });

  const fetchPage = useCallback(
    async (
      nextPage: number,
      keyword: string,
      append: boolean,
    ) => {
      const result = await loadCategories({
        variables: {
          filter: {
            search: keyword.trim() || undefined,
            page: nextPage,
            limit: 20,
          },
        },
      });

      const data = result.data?.categoryOptions;

      if (!data) {
        return;
      }

      setItems((prev) => {
        if (!append) {
          return data.items;
        }

        const existingIds = new Set(
          prev.map((item) => item.id),
        );

        return [
          ...prev,
          ...data.items.filter(
            (item) => !existingIds.has(item.id),
          ),
        ];
      });

      setPage(data.page);
      setHasNextPage(data.hasNextPage);
    },
    [loadCategories],
  );

  const open = useCallback(() => {
    setOpened(true);

    if (items.length === 0) {
      fetchPage(1, search, false);
    }
  }, [
    fetchPage,
    items.length,
    search,
  ]);

  const close = useCallback(() => {
    setOpened(false);
  }, []);

  const onSearchChange = useCallback(
    (value: string) => {
      setSearch(value);
      setPage(1);

      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      timerRef.current = setTimeout(() => {
        fetchPage(
          1,
          value,
          false,
        );
      }, 700);
    },
    [fetchPage],
  );

  const loadMore = useCallback(() => {
    if (
      loading ||
      !hasNextPage
    ) {
      return;
    }

    fetchPage(
      page + 1,
      search,
      true,
    );
  }, [
    fetchPage,
    hasNextPage,
    loading,
    page,
    search,
  ]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return {
    opened,
    items,
    loading,
    error,
    hasNextPage,
    open,
    close,
    search,
    onSearchChange,
    loadMore,
  };
}