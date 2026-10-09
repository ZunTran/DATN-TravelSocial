import { gql } from '@apollo/client';

export const CATEGORY_OPTIONS_QUERY = gql`
  query CategoryOptions(
    $filter: CategoryFilterInput
  ) {
    categoryOptions(filter: $filter) {
      items {
        id
        name
        description
      }

      total
      page
      limit
      totalPages
      hasNextPage
    }
  }
`;