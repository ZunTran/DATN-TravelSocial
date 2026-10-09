export const LOCATION_OPTIONS_QUERY = `
  query LocationOptions($filter: LocationFilterInput) {
    locationOptions(filter: $filter) {
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



export const ADMIN_LOCATION_QUERY =`
  query AdminLocations($filter: AdminLocationFilterInput) {
    adminLocations(filter: $filter) {
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

export const ADMIN_CREATE_LOCATION_MUTATION = `
  mutation CreateLocation($input: CreateLocationInput!) {
    createLocation(input: $input) {
      id
      name
      address
      latitude
      longitude
      province
    }
  }
`;

export const ADMIN_UPDATE_LOCATION_MUTATION = `
  mutation UpdateLocation($input: UpdateLocationInput!) {
    updateLocation(input: $input) {
      id
      name
      address
      latitude
      longitude
      province
    }
  }
`;

export const ADMIN_DELETE_LOCATION_MUTATION = `
  mutation DeleteLocation($id: ID!) {
    deleteLocation(id: $id)
  }
`;