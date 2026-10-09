import { gql } from '@apollo/client';

export const LOCATION_OPTIONS_QUERY = gql`
  query LocationOptions($filter: LocationFilterInput!) {
    locations(filter: $filter) {
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