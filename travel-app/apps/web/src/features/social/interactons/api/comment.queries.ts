import { gql } from '@apollo/client';

export const POST_COMMENTS_QUERY = gql`
 query GetPostComments(
    $postId: ID!
    $pagination: PaginationInput
  ) {
    comments(
      postId: $postId
      pagination: $pagination
    ) {
      items {
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
      total
      page
      limit
      totalPages
      hasNextPage
    }
  }
`;