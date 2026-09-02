import { gql } from '@apollo/client';

export const SHARE_POST = gql`
  mutation SharePost($postId: ID!) {
    sharePost(postId: $postId) {
      id
      postId
      userId
      createdAt
    }
  }
`;

export const GET_SHARES = gql`
  query Shares(
    $postId: ID!
    $pagination: PaginationInput!
  ) {
    shares(
      postId: $postId
      pagination: $pagination
    ) {
      items {
        id
        postId
        userId
        createdAt
      }

      total
      page
      limit
      totalPages
    }
  }
`;