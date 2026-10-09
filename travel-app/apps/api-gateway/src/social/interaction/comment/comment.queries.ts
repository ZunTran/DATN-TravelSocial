export const GET_COMMENTS = `
  query Comments(
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

export const CREATE_COMMENT   = `
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

export const UPDATE_COMMENT = `
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

export const DELETE_COMMENT = `
  mutation DeleteComment(
    $commentId: ID!
  ) {
    deleteComment(
      commentId: $commentId
    )
  }
`;

export const GET_REPLIES = `
  query Replies(
    $commentId: ID!
  ) {
    replies(
      commentId: $commentId
    ) {
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