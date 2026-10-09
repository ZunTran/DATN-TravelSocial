

export const POST_QUERY=`
        query Post(
          $postId: ID!
        ) {
          post(postId: $postId) {
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
        }
        `

export const POSTS_QUERY=`
        query Posts(
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
        `

export const SEARCH_POSTS_QUERY=`
      query SearchPosts(
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
      `
export const CREATE_POST_MUTATION=`
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

            hashtags {
              id
              name
            }

          }
        }
        `



export const CREATE_POST_WFILE_MUTATION=`
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
      }
      `

  export const UPDATE_POST_MUTATION =`
              mutation UpdatePost(
                $input: UpdatePostInput!
              ) {
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
              }
              `
  export const UPDATE_POST_WFILE_MUTATION =`
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
        }
        `

    export const DELETE_POST_MUTATION=   `
        mutation DeletePost(
          $postId: ID!
        ) {
          deletePost(postId: $postId) {
            id
            status
          }
        }
        `
    
    export const POST_STATUS_MUTATION=   `
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
            `

    export const POST_PRIVACY_MUTATION=   `
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
        `

export const PROFILE_POSTS_QUERY = `
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

export const MY_DRAFT_POSTS_QUERY = `
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