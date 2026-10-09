import { gql } from '@apollo/client';

export const SEARCH_POSTS_QUERY = gql`
  query SearchPosts(
    $keyword: String!
    $page: Int
    $limit: Int
  ) {
    searchPosts(
      keyword: $keyword
      page: $page
      limit: $limit
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