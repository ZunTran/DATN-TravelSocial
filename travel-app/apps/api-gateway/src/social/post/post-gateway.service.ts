import {
  Injectable,
} from '@nestjs/common';

import {
  CreatePostInput,
  UpdatePostInput,
  PostFilterInput,
  PaginationInput,
} from './dto/post.inputs';

import {
  PostPrivacy,
  PostStatus,
  PostObject,
  PostListObject,
  SocialPostResponse,
} from './types/post.types';

import {
  SocialGraphqlClient,
} from '../clients/social-graphql.client';

import {
  normalizePost,
  normalizePostList,
} from '../common/post-normalizer';

import type { FileUpload } from 'graphql-upload-ts';

interface CreatePostResponse {
  createPost: SocialPostResponse;
}

interface UpdatePostResponse {
  updatePost: SocialPostResponse;
}

interface DeletePostResponse {
  deletePost: Pick<
    PostObject,
    'id' | 'status'
  >;
}

interface UpdatePostWithFilesResponse {
  updatePostWithFiles: SocialPostResponse;
}

interface PostResponse {
  post: SocialPostResponse;
}

interface PostsResponse {
  posts: {
    items: SocialPostResponse[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

interface ViewPostResponse {
  viewPost: Pick<
    PostObject,
    'id' | 'viewCount'
  >;
}

interface ChangePostStatusResponse {
  changePostStatus: Pick<
    PostObject,
    'id' | 'status' | 'updatedAt'
  >;
}

interface ChangePostPrivacyResponse {
  changePostPrivacy: Pick<
    PostObject,
    'id' | 'privacy' | 'updatedAt'
  >;
}

interface CreatePostWithFilesResponse {
  createPostWithFiles: SocialPostResponse;
}


@Injectable()
export class PostGatewayService {
  constructor(
    private readonly socialClient: SocialGraphqlClient,
  ) {}
  async createPost(
    input: CreatePostInput,
    authorization?: string,
  ): Promise<PostObject> {
    const data =
      await this.socialClient.execute<CreatePostResponse>(
        `
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
          }
        }
        `,
        { input },
        authorization,
      );

    return normalizePost(
      data.createPost,
    );
  }

  async createPostWithFiles(
  input: CreatePostInput,
  files?: Promise<FileUpload>[],
  authorization?: string,
): Promise<PostObject> {
  const data =
    await this.socialClient.executeMultipart<CreatePostWithFilesResponse>(
      `
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
        }
      }
      `,
      {
        input,
        files: files?.map(() => null),
      },
      files ?? [],
      authorization,
    );

  return normalizePost(
    data.createPostWithFiles,
  );
}

  async updatePost(
    input: UpdatePostInput,
    authorization?: string,
  ): Promise<PostObject> {
    const data =
      await this.socialClient.execute<UpdatePostResponse>(
        `
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
          }
        }
        `,
        { input },
        authorization,
      );

    return normalizePost(
      data.updatePost,
    );
  }

  async updatePostWithFiles(
  input: UpdatePostInput,
  files?: Promise<FileUpload>[],
  authorization?: string,
    ): Promise<PostObject> {
    const data =
        await this.socialClient.executeMultipart<UpdatePostWithFilesResponse>(
        `
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
            }
        }
        `,
        {
            input,
            files: files?.map(() => null),
        },
        files ?? [],
        authorization,
        );

    return normalizePost(
        data.updatePostWithFiles,
    );
    }

  async deletePost(
    postId: string,
    authorization?: string,
  ): Promise<
    Pick<PostObject, 'id' | 'status'>
  > {
    const data =
      await this.socialClient.execute<DeletePostResponse>(
        `
        mutation DeletePost(
          $postId: ID!
        ) {
          deletePost(postId: $postId) {
            id
            status
          }
        }
        `,
        { postId },
        authorization,
      );

    return data.deletePost;
  }


  async post(
    postId: string,
    authorization?: string,
  ): Promise<PostObject> {
    const data =
      await this.socialClient.execute<PostResponse>(
        `
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
          }
        }
        `,
        { postId },
        authorization,
      );

    return normalizePost(
      data.post,
    );
  }

  async posts(
    filter?: PostFilterInput,
    pagination?: PaginationInput,
    authorization?: string,
  ): Promise<PostListObject> {
    const data =
      await this.socialClient.execute<PostsResponse>(
        `
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
            }

            total
            page
            limit
            totalPages
          }
        }
        `,
        {
          filter,
          pagination: pagination ?? {
            page: 1,
            limit: 20,
          },
        },
        authorization,
      );

    console.log(
      '========== GATEWAY POSTS RESPONSE ==========',
    );

    console.log(
      data.posts.items.map(
        (post) => ({
          id: post.id,
          authorId: post.authorId,
          isPostLiked:
            post.isPostLiked,
          isPostSaved:
            post.isPostSaved,
          typeLiked:
            typeof post.isPostLiked,
          typeSaved:
            typeof post.isPostSaved,
        }),
      ),
    );

    console.log(
      '=============================================',
    );

    return normalizePostList(
      data.posts,
    );
  }

  async viewPost(
    postId: string,
  ): Promise<
    Pick<PostObject, 'id' | 'viewCount'>
  > {
    const data =
      await this.socialClient.execute<ViewPostResponse>(
        `
        mutation ViewPost(
          $postId: ID!
        ) {
          viewPost(postId: $postId) {
            id
            viewCount
          }
        }
        `,
        { postId },
      );

    return data.viewPost;
  }


  async changePostStatus(
    postId: string,
    newStatus: PostStatus,
    authorization?: string,
  ): Promise<
    Pick<
      PostObject,
      'id' | 'status' | 'updatedAt'
    >
  > {
    const data =
      await this.socialClient.execute<ChangePostStatusResponse>(
        `
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
        `,
        {
          postId,
          newStatus,
        },
        authorization,
      );

    return data.changePostStatus;
  }

  async changePostPrivacy(
    postId: string,
    newPrivacy: PostPrivacy,
    authorization?: string,
  ): Promise<
    Pick<
      PostObject,
      'id' | 'privacy' | 'updatedAt'
    >
  > {
    const data =
      await this.socialClient.execute<ChangePostPrivacyResponse>(
        `
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
        `,
        {
          postId,
          newPrivacy,
        },
        authorization,
      );

    return data.changePostPrivacy;
  }

  
}