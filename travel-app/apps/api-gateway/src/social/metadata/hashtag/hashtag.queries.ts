export const HASHTAGS_QUERY = `
  query Hashtags {
    hashtags {
      id
      name
    }
  }
`;

export const HASHTAG_OPTIONS_QUERY = `
  query HashtagOptions(
    $filter: HashtagFilterInput
  ) {
    hashtagOptions(
      filter: $filter
    ) {
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

export const CREATE_HASHTAG_MUTATION = `
  mutation CreateHashtag(
    $input: CreateHashtagInput!
  ) {
    createHashtag(input: $input) {
      id
      name
    }
  }
`;

export const UPDATE_HASHTAG_MUTATION = `
  mutation UpdateHashtag(
    $input: UpdateHashtagInput!
  ) {
    updateHashtag(input: $input) {
      id
      name
    }
  }
`;

export const ADMIN_HASHTAGS_QUERY = `
  query AdminHashtags(
    $filter: AdminHashtagFilterInput!
  ) {
    adminHashtags(filter: $filter) {
      items {
        id
        name
        postCount
      }
      total
      page
      limit
      totalPages
    }
  }
`;

export const ADMIN_DELETE_HASHTAG_MUTATION = `
  mutation AdminDeleteHashtag(
    $id: ID!
  ) {
    adminDeleteHashtag(id: $id)
  }
`;