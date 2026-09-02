import { gql } from "@apollo/client";

export const GET_FEED = gql`
  query GetFeed($input: FeedInput!) {
    feed(input: $input) {
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

      hasNextPage
      endCursor
    }
  }
`;