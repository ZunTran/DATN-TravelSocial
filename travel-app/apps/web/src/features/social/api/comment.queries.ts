import { gql } from '@apollo/client';

export const GET_COMMENTS = gql`
  query Comments(
    $postId: ID!
    $pagination: PaginationInput!
  ) {
    comments(
      postId: $postId
      pagination: $pagination
    ) {
      items {
        id
        postId
        authorId
        parentCommentId
        content
        createdAt
      }

      total
      page
      limit
      totalPages
    }
  }
`;

export const CREATE_COMMENT = gql`
  mutation CreateComment(
    $input: CreateCommentInput!
  ) {
    createComment(input: $input) {
      id
      postId
      authorId
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
    deleteComment(commentId: $commentId)
  }
`;

export const GET_REPLIES = gql`
  query Replies($commentId: ID!) {
    replies(commentId: $commentId) {
      id
      postId
      authorId
      parentCommentId
      content
      createdAt
    }
  }
`;