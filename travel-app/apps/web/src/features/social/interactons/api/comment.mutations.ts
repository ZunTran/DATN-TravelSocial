import { gql } from '@apollo/client';

export const CREATE_COMMENT = gql`
  mutation CreateComment(
    $input: CreateCommentInput!
  ) {
    createComment(input: $input) {
      id
      postId
      authorId
      author {
        id
        username
        avatarUrl
      }
      parentCommentId
      content
      createdAt
    }
  }
`;

export const UPDATE_COMMENT = gql`
  mutation UpdateComment(
    $input: UpdateCommentInput!
  ) {
    updateComment(input: $input) {
      id
      postId
      authorId
      author {
        id
        username
        avatarUrl
      }
      parentCommentId
      content
      createdAt
    }
  }
`;

export const DELETE_COMMENT = gql`
  mutation DeleteComment(
    $commentId: ID!
  ) {
    deleteComment(
      commentId: $commentId
    )
  }
`;