import {
  gql,
} from '@apollo/client';

export const LOCATIONS_QUERY = gql`
  query Locations(
    $filter: LocationFilterInput
  ) {
    locations(
      filter: $filter
    ) {
      items {
        id
        name
        address
        latitude
        longitude
        province
      }
      total
      page
      limit
      totalPages
      hasNextPage
    }
  }
`;

export const ADMIN_LOCATIONS_QUERY = gql`
  query AdminLocations(
    $filter: AdminLocationFilterInput
  ) {
    adminLocations(
      filter: $filter
    ) {
      items {
        id
        name
        address
        latitude
        longitude
        province
      }
      total
      page
      limit
      totalPages
      hasNextPage
    }
  }
`;

export const CREATE_LOCATION_MUTATION = gql`
  mutation CreateLocation(
    $input: CreateLocationInput!
  ) {
    createLocation(
      input: $input
    ) {
      id
      name
      address
      latitude
      longitude
      province
    }
  }
`;

export const UPDATE_LOCATION_MUTATION = gql`
  mutation UpdateLocation(
    $input: UpdateLocationInput!
  ) {
    updateLocation(
      input: $input
    ) {
      id
      name
      address
      latitude
      longitude
      province
    }
  }
`;

export const DELETE_LOCATION_MUTATION = gql`
  mutation DeleteLocation(
    $id: ID!
  ) {
    deleteLocation(
      id: $id
    )
  }
`;