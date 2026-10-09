

import type { FileUpload } from 'graphql-upload-ts';
import { CREATE_POST_MUTATION, CREATE_POST_WFILE_MUTATION, DELETE_POST_MUTATION, MY_DRAFT_POSTS_QUERY, POST_PRIVACY_MUTATION, POST_QUERY, POST_STATUS_MUTATION, POSTS_QUERY, PROFILE_POSTS_QUERY, SEARCH_POSTS_QUERY, UPDATE_POST_MUTATION, UPDATE_POST_WFILE_MUTATION } from './post.queries';
import { PostListObject, PostObject, PostPrivacy, PostStatus, SocialPostResponse } from './types/post.types';
import { Injectable } from '@nestjs/common';
import { SocialGraphqlClient } from '../clients/social-graphql.client';
import { CreatePostInput, PaginationInput, PostFilterInput, UpdatePostInput } from './dto/post.inputs';
import { normalizePost, normalizePostList } from '../common/post-normalizer';

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
    hasNextPage: boolean;
  };
}

interface ProfilePostsResponse {
  profilePosts: {
    items: SocialPostResponse[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
  };
}

interface MyDraftPostsResponse {
  myDraftPosts: {
    items: SocialPostResponse[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
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
    const data =await this.socialClient.execute<CreatePostResponse>(CREATE_POST_MUTATION,
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
  const data = await this.socialClient.executeMultipart<CreatePostWithFilesResponse>(CREATE_POST_WFILE_MUTATION,
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
      await this.socialClient.execute<UpdatePostResponse>(UPDATE_POST_MUTATION,
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
        await this.socialClient.executeMultipart<UpdatePostWithFilesResponse>(UPDATE_POST_WFILE_MUTATION,
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
      await this.socialClient.execute<DeletePostResponse>(DELETE_POST_MUTATION,
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
      await this.socialClient.execute<PostResponse>(POST_QUERY,
        { postId },
        authorization,
      );

    return normalizePost(data.post);
  }

  async posts(
    filter?: PostFilterInput,
    pagination?: PaginationInput,
    authorization?: string,
  ): Promise<PostListObject> {
    const data =
      await this.socialClient.execute<PostsResponse>(POSTS_QUERY,
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
          isPostLiked: post.isPostLiked??false,
          isPostSaved: post.isPostSaved??false,
          typeLiked: typeof post.isPostLiked,
          typeSaved: typeof post.isPostSaved,
        }),
      ),
    );

    return normalizePostList(data.posts);
  }

  async profilePosts(
  profileId: string,
  page = 1,
  limit = 10,
  authorization?: string,
): Promise<PostListObject> {
  const data = await this.socialClient.execute<ProfilePostsResponse>(
    PROFILE_POSTS_QUERY,
    {
      profileId,
      page,
      limit,
    },
    authorization,
  );

  return normalizePostList(data.profilePosts);
}

async myDraftPosts(
  page = 1,
  limit = 10,
  authorization?: string,
): Promise<PostListObject> {
  const data = await this.socialClient.execute<MyDraftPostsResponse>(
    MY_DRAFT_POSTS_QUERY,
    {
      page,
      limit,
    },
    authorization,
  );

  return normalizePostList(data.myDraftPosts);
}

async viewPost(
  postId: string,
  authorization?: string,
): Promise<
  Pick<PostObject, 'id' | 'viewCount'>
> {
  const data = await this.socialClient.execute<ViewPostResponse>(
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
    authorization,
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
      await this.socialClient.execute<ChangePostStatusResponse>(POST_STATUS_MUTATION,
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
    Pick< PostObject, 'id' | 'privacy' | 'updatedAt'>> {
    const data = await this.socialClient.execute<ChangePostPrivacyResponse>(POST_PRIVACY_MUTATION,
        {
          postId,
          newPrivacy,
        },
        authorization,
      );

    return data.changePostPrivacy;
  }

async searchPosts(
  keyword: string,
  page: number,
  limit: number,
  authorization?: string,
): Promise<PostListObject> {
  const data = await this.socialClient.execute<PostsResponse>(SEARCH_POSTS_QUERY,
      {
        filter: {
          keyword: keyword.trim(),
        },
        pagination: {
          page,
          limit,
        },
      },
      authorization,
    );

  return normalizePostList(data.posts);
}
}