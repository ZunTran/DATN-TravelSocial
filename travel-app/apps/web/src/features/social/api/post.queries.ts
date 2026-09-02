import { gql } from '@apollo/client';

export const GET_POSTS = gql`
  query GetPosts(
    $filter: PostFilterInput
    $pagination: PaginationInput
  ) {
    posts(
      filter: $filter
      pagination: $pagination
    ) {
      items {
        id
        authorId
        categoryId
        locationId
        content
        privacy
        status
        createdAt
        updatedAt

        viewCount
        likeCount
        commentCount
        shareCount
        saveCount

         isPostLiked
        isPostSaved

        authorUsername
        authorAvatar

        media {
          id
          mediaUrl
          mediaType
          displayOrder
        }

        category {
          id
          name
          description
        }

        location {
          id
          name
          address
          latitude
          longitude
          province
        }
      }

      total
      page
      limit
      totalPages
    }
  }
`;