import { gql } from '@apollo/client';

export const POSTS_QUERY = gql`
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

        hashtags {
            id
            name
          }

      }

      total
      page
      limit
      totalPages
      hasNextPage
    }
  }
`;



export const PROFILE_POSTS_QUERY = gql`
  query ProfilePosts(
    $profileId: ID!
    $page: Int
    $limit: Int
  ) {
    profilePosts(
      profileId: $profileId
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

        hashtags {
          id
          name
        }
      }

      total
      page
      limit
      totalPages
      hasNextPage
    }
  }
`;


export const MY_DRAFTS_QUERY = gql`
  query MyDraftPosts(
    $page: Int
    $limit: Int
  ) {
    myDraftPosts(
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

        hashtags {
          id
          name
        }
      }

      total
      page
      limit
      totalPages
      hasNextPage
    }
  }
`;

export const GET_POST_DETAIL = gql`
  query GetPostDetail($postId: ID!) {
post(postId: $postId){
      id
      content
      createdAt
      privacy
      status

      authorUsername
      authorAvatar

      likeCount
      commentCount
      shareCount
      saveCount
      viewCount

      isPostLiked
      isPostSaved

      category {
        id
        name
      }

      location {
        id
        name
        address
      }

      hashtags {
        id
        name
      }

      media {
          id
          mediaUrl
          mediaType
          displayOrder
        }
    }
  }
`;