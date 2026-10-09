import { gql } from '@apollo/client';

export const HASHTAG_OPTIONS_QUERY = gql`
  query HashtagOptions($filter: HashtagFilterInput) {
    hashtagOptions(filter: $filter) {
      items {
        id
        name
      }
      total
      page
      limit
      totalPages
      hasNextPage
    }
  }
`;