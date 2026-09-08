import { gql } from "@apollo/client";

export const GET_SAVED_POSTS = gql`
  query SavedPosts($pagination: PaginationInput!) {
    savedPosts(pagination: $pagination) {
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