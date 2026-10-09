'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useLazyQuery } from '@apollo/client/react';
import { LOCATION_OPTIONS_QUERY } from '../api/location.queries';
import type { LocationPage } from '../types/location.types';

interface LocationOptionsResponse {
  locations: LocationPage;
}

interface LocationOptionsVariables {
  filter: {
    search?: string;
    province?: string;
    page: number;
    limit: number;
  };
}

export function useLocationOptions() {
  const [opened, setOpened] = useState(false);
  const [search, setSearch] = useState('');
  const [items, setItems] = useState<LocationPage['items']>([]);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [loadLocations, { loading, error }] = useLazyQuery<
    LocationOptionsResponse,
    LocationOptionsVariables
  >(LOCATION_OPTIONS_QUERY, {
    fetchPolicy: 'network-only',
  });

  const fetchPage = useCallback(
    async (nextPage: number, keyword: string, append: boolean) => {
      const result = await loadLocations({
        variables: {
          filter: {
            search: keyword.trim() || undefined,
            page: nextPage,
            limit: 20,
          },
        },
      });

      const data = result.data?.locations;

      if (!data) return;

      setItems(previous => {
        if (!append) return data.items;

        const existingIds = new Set(previous.map(item => item.id));

        return [
          ...previous,
          ...data.items.filter(item => !existingIds.has(item.id)),
        ];
      });

      setPage(data.page);
      setHasNextPage(data.hasNextPage);
    },
    [loadLocations],
  );

  const open = useCallback(() => {
    setOpened(true);

    if (items.length === 0) {
      fetchPage(1, search, false);
    }
  }, [fetchPage, items.length, search]);

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
        fetchPage(1, value, false);
      }, 700);
    },
    [fetchPage],
  );

  const loadMore = useCallback(() => {
    if (loading || !hasNextPage) return;

    fetchPage(page + 1, search, true);
  }, [fetchPage, hasNextPage, loading, page, search]);

  const reset = useCallback(() => {
    setOpened(false);
    setSearch('');
    setItems([]);
    setPage(1);
    setHasNextPage(false);
  }, []);

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
    search,
    open,
    close,
    onSearchChange,
    loadMore,
    reset,
  };
}