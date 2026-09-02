import { gql } from '@apollo/client';

export const SAVE_POST = gql`
  mutation SavePost($postId: ID!) {
    savePost(postId: $postId) {
      postId
      userId
      savedAt
    }
  }
`;

export const UNSAVE_POST = gql`
  mutation UnsavePost($postId: ID!) {
    unsavePost(postId: $postId) {
      postId
      userId
      savedAt
    }
  }
`;

