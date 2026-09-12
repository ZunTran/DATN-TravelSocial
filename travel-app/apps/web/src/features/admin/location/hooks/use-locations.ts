'use client';

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  useLazyQuery,
} from '@apollo/client/react';

import {
  LOCATIONS_QUERY,
} from '../api/location.queries';

import type {
  Location,
} from '../types/location.types';

interface LocationsQueryData {
  locations: {
    items: Location[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
  };
}

interface LocationsQueryVariables {
  filter: {
    search?: string;
    province?: string;
    page: number;
    limit: number;
  };
}

export function useLocations() {
  const [
    fetchLocations,
    {
      loading,
      error,
    },
  ] = useLazyQuery<
    LocationsQueryData,
    LocationsQueryVariables
  >(
    LOCATIONS_QUERY,
    {
      fetchPolicy: 'network-only',
    },
  );

  const [
    locations,
    setLocations,
  ] = useState<Location[]>([]);

  const [
    keyword,
    setKeyword,
  ] = useState('');

  const [
    page,
    setPage,
  ] = useState(1);

  const [
    hasNextPage,
    setHasNextPage,
  ] = useState(true);

  const loadingRef =
    useRef(false);

  const pageRef =
    useRef(1);

  const searchRef =
    useRef('');

  const load = useCallback(
    async ({
      search,
      page: targetPage = 1,
      reset = false,
    }: {
      search?: string;
      page?: number;
      reset?: boolean;
    } = {}) => {
      if (loadingRef.current) {
        return;
      }

      if (
        !reset &&
        !hasNextPage
      ) {
        return;
      }

      loadingRef.current = true;

      try {
        const currentSearch =
          search !== undefined
            ? search.trim()
            : searchRef.current;

        searchRef.current =
          currentSearch;

        pageRef.current =
          targetPage;

        const result =
          await fetchLocations({
            variables: {
              filter: {
                search:
                  currentSearch ||
                  undefined,

                page: targetPage,

                limit: 20,
              },
            },
          });

        const data =
          result.data?.locations;

        if (!data) {
          return;
        }

        setLocations(
          (previous) =>
            reset
              ? data.items
              : [
                  ...previous,
                  ...data.items,
                ],
        );

        setPage(
          data.page,
        );

        setHasNextPage(
          data.hasNextPage,
        );
      } finally {
        loadingRef.current = false;
      }
    },
    [
      fetchLocations,
      hasNextPage,
    ],
  );

  const search = useCallback(
    async (value: string) => {
      setKeyword(value);

      return load({
        search: value,
        page: 1,
        reset: true,
      });
    },
    [load],
  );

  const loadMore = useCallback(
    async () => {
      if (
        loadingRef.current ||
        !hasNextPage
      ) {
        return;
      }

      return load({
        search:
          searchRef.current,

        page:
          pageRef.current + 1,

        reset: false,
      });
    },
    [
      load,
      hasNextPage,
    ],
  );

  const clear = useCallback(() => {
    searchRef.current = '';

    pageRef.current = 1;

    setKeyword('');

    setLocations([]);

    setPage(1);

    setHasNextPage(true);
  }, []);

  /**
   * Initial load + debounce search.
   *
   * Không cần firstRenderRef nữa.
   */
  useEffect(() => {
    const timer =
      setTimeout(() => {
        load({
          search: keyword,
          page: 1,
          reset: true,
        });
      }, keyword ? 400 : 0);

    return () => {
      clearTimeout(timer);
    };
  }, [
    keyword,
    load,
  ]);

  return {
    locations,
    loading,
    error,

    keyword,
    setKeyword,

    page,
    hasNextPage,

    search,
    loadMore,
    clear,
  };
}