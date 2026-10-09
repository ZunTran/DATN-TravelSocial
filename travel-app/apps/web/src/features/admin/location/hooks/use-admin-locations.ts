'use client';

import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import {
  useMutation,
  useQuery,
} from '@apollo/client/react';

import {
  ADMIN_LOCATIONS_QUERY,
  CREATE_LOCATION_MUTATION,
  UPDATE_LOCATION_MUTATION,
  DELETE_LOCATION_MUTATION,
} from '../api/location.queries';

import type {
  Location,
  LocationPage,
  CreateLocationInput,
  UpdateLocationInput,
} from '../types/location.types';

interface AdminLocationsQueryData {
  adminLocations: LocationPage;
}

interface AdminLocationsQueryVariables {
  filter: {
    search?: string;
    province?: string;
    page: number;
    limit: number;
  };
}

interface CreateLocationData {
  createLocation: Location;
}

interface CreateLocationVariables {
  input: CreateLocationInput;
}

interface UpdateLocationData {
  updateLocation: Location;
}

interface UpdateLocationVariables {
  input: UpdateLocationInput;
}

interface DeleteLocationData {
  deleteLocation: boolean;
}

interface DeleteLocationVariables {
  id: string;
}

export function useAdminLocations() {
  const [
    page,
    setPage,
  ] = useState(1);

  const [
    search,
    setSearch,
  ] = useState('');

  const [
    province,
    setProvince,
  ] = useState('');

  const {
    data,
    loading,
    error,
    refetch,
  } = useQuery<
    AdminLocationsQueryData,
    AdminLocationsQueryVariables
  >(
    ADMIN_LOCATIONS_QUERY,
    {
      variables: {
        filter: {
          search:
            search.trim() ||
            undefined,

          province:
            province.trim() ||
            undefined,

          page,

          limit: 20,
        },
      },

      fetchPolicy:
        'network-only',
    },
  );

  const [
    createLocation,
    {
      loading:
        creating,
    },
  ] = useMutation<
    CreateLocationData,
    CreateLocationVariables
  >(
    CREATE_LOCATION_MUTATION,
  );

  const [
    updateLocation,
    {
      loading:
        updating,
    },
  ] = useMutation<
    UpdateLocationData,
    UpdateLocationVariables
  >(
    UPDATE_LOCATION_MUTATION,
  );

  const [
    deleteLocation,
    {
      loading:
        deleting,
    },
  ] = useMutation<
    DeleteLocationData,
    DeleteLocationVariables
  >(
    DELETE_LOCATION_MUTATION,
  );

  const adminLocations = data?.adminLocations;
  const locations =  adminLocations?.items ?? [];

  const [
    pendingSearch,
    setPendingSearch,
  ] = useState('');

  useEffect(() => {
    const timer =
      setTimeout(() => {
        setSearch(
          pendingSearch,
        );

        setPage(1);
      }, 700);

    return () => {
      clearTimeout(timer);
    };
  }, [
    pendingSearch,
  ]);

  const changeProvince =
    useCallback(
      (value: string) => {
        setProvince(value);
        setPage(1);
      },
      [],
    );

  const goToPage =
    useCallback(
      (nextPage: number) => {
        if (
          nextPage < 1
        ) {
          return;
        }

        if (
          adminLocations &&
          nextPage >
            adminLocations.totalPages
        ) {
          return;
        }

        setPage(nextPage);
      },
      [
        adminLocations,
      ],
    );

  const create =
    useCallback(
      async (
        input: CreateLocationInput,
      ) => {
        const result =
          await createLocation({
            variables: {
              input,
            },
          });

        await refetch();

        return result.data
          ?.createLocation;
      },
      [
        createLocation,
        refetch,
      ],
    );

  const update =
    useCallback(
      async (
        input: UpdateLocationInput,
      ) => {
        const result =
          await updateLocation({
            variables: {
              input,
            },
          });

        await refetch();

        return result.data
          ?.updateLocation;
      },
      [
        updateLocation,
        refetch,
      ],
    );

  const remove =
    useCallback(
      async (
        id: string,
      ) => {
        const result =
          await deleteLocation({
            variables: {
              id,
            },
          });

        await refetch();

        return result.data
          ?.deleteLocation;
      },
      [
        deleteLocation,
        refetch,
      ],
    );

  return {
    locations,

    total:
      adminLocations?.total ?? 0,

    page:
      adminLocations?.page ?? page,

    limit:
      adminLocations?.limit ?? 20,

    totalPages:
      adminLocations?.totalPages ?? 0,

    hasNextPage:
      adminLocations?.hasNextPage ??
      false,

    loading,

    creating,
    updating,
    deleting,

    error,

    search:
      pendingSearch,

    setSearch:
      setPendingSearch,

    province,

    setProvince:
      changeProvince,

    goToPage,

    createLocation:
      create,

    updateLocation:
      update,

    deleteLocation:
      remove,

    refetch,
  };
}