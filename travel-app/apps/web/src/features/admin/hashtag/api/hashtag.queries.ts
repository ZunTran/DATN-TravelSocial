import { gql } from '@apollo/client';
export const GET_ADMIN_HASHTAGS = gql`
  query AdminHashtags(
    $filter: AdminHashtagFilterInput
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

export const CREATE_ADMIN_HASHTAG = gql`
  mutation CreateHashtag(
    $input: CreateHashtagInput!
  ) {
    createHashtag(input: $input) {
      id
      name
    }
  }
`;

export const UPDATE_ADMIN_HASHTAG = gql`
  mutation UpdateHashtag(
    $input: UpdateHashtagInput!
  ) {
    updateHashtag(input: $input) {
      id
      name
    }
  }
`;

export const DELETE_ADMIN_HASHTAG = gql`
  mutation AdminDeleteHashtag(
    $id: ID!
  ) {
    adminDeleteHashtag(id: $id)
  }
`;
