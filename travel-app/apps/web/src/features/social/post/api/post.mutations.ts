import { gql } from '@apollo/client';

export const CREATE_POST = gql`
  mutation CreatePost(
    $input: CreatePostInput!
  ) {
    createPost(input: $input) {
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

      isPostLiked
      isPostSaved

    }
  }
`;

export const UPDATE_POST = gql`
    mutation UpdatePost($input: UpdatePostInput!) {
    updatePost(input: $input) {
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
  }
`;

export const DELETE_POST = gql`
  mutation DeletePost(
    $postId: ID!
  ) {
    deletePost(postId: $postId) {
      id
      status
    }
  }
`;

export const CHANGE_POST_STATUS = gql`
  mutation ChangePostStatus(
    $postId: ID!
    $newStatus: PostStatus!
  ) {
    changePostStatus(
      postId: $postId
      newStatus: $newStatus
    ) {
      id
      status
      updatedAt
    }
  }
`;

export const CHANGE_POST_PRIVACY = gql`
  mutation ChangePostPrivacy(
    $postId: ID!
    $newPrivacy: PostPrivacy!
  ) {
    changePostPrivacy(
      postId: $postId
      newPrivacy: $newPrivacy
    ) {
      id
      privacy
      updatedAt
    }
  }
`;

export const VIEW_POST = gql`
  mutation ViewPost($postId: ID!) {
    viewPost(postId: $postId) {
      id
      viewCount
    }
  }
`;

export const CREATE_POST_WITH_FILES = gql`
  mutation CreatePostWithFiles(
    $input: CreatePostInput!
    $files: [Upload!]
  ) {
    createPostWithFiles(
      input: $input
      files: $files
    ) {
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

      isPostLiked
      isPostSaved

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
  }
`;

export const UPDATE_POST_WITH_FILES = gql`
  mutation UpdatePostWithFiles(
    $input: UpdatePostInput!
    $files: [Upload!]
  ) {
    updatePostWithFiles(
      input: $input
      files: $files
    ) {
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

      isPostLiked
      isPostSaved

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
  }
`;