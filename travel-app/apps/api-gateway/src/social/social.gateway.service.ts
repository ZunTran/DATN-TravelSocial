import {
  BadGatewayException,
  Injectable,
} from '@nestjs/common';

import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

import { SERVICE_URLS } from '../config/service-url.config';

import {
  CreatePostInput,
  UpdatePostInput,
  PostFilterInput,
  PaginationInput,
} from './post/post.inputs';

import {
  PostPrivacy,
  PostStatus,
  PostObject,
  PostListObject,
  SocialPostResponse,
} from './post/post.types';

import {
  CreateCommentInput,
  UpdateCommentInput,
} from './interaction/interaction.inputs';

import {
  CreateCategoryInput,
  UpdateCategoryInput,
  CreateLocationInput,
  UpdateLocationInput,
  CreateHashtagInput,
  UpdateHashtagInput,
} from './metadata/metadata.inputs';

import {
  LikeObject,
  LikeList,
  CommentObject,
  CommentList,
  SavePostObject,
  ShareObject,
  ShareList,
} from './interaction/interaction.types';

import {
  CategoryObject,
  LocationObject,
  HashtagObject,
} from './metadata/metadata.types';
import { FeedPageObject } from './post/feed.types';
import { FeedInput } from './post/feed.inputs';

// ============================================================
// GRAPHQL RESPONSE TYPES
// ============================================================

interface GraphQLResponse<T> {
  data: T;
  errors?: Array<{
    message: string;
  }>;
}

interface CreatePostResponse {
  createPost: SocialPostResponse;
}

interface UpdatePostResponse {
  updatePost: SocialPostResponse;
}

interface DeletePostResponse {
  deletePost: Pick<PostObject, 'id' | 'status'>;
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
  viewPost: Pick<PostObject, 'id' | 'viewCount'>;
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

interface LikePostResponse {
  likePost: LikeObject;
}

interface UnlikePostResponse {
  unlikePost: LikeObject;
}

interface IsPostLikedResponse {
  isPostLiked: boolean;
}

interface LikesResponse {
  likes: LikeList;
}

interface SavePostResponse {
  savePost: SavePostObject;
}

interface UnsavePostResponse {
  unsavePost: SavePostObject;
}

interface IsPostSavedResponse {
  isPostSaved: boolean;
}

interface CreateCommentResponse {
  createComment: CommentObject;
}

interface UpdateCommentResponse {
  updateComment: CommentObject;
}

interface DeleteCommentResponse {
  deleteComment: boolean;
}

interface CommentsResponse {
  comments: CommentList;
}

interface RepliesResponse {
  replies: CommentObject[];
}

interface SharePostResponse {
  sharePost: ShareObject;
}

interface SharesResponse {
  shares: ShareList;
}

interface CategoriesResponse {
  categories: CategoryObject[];
}

interface LocationsResponse {
  locations: LocationObject[];
}

interface HashtagsResponse {
  hashtags: HashtagObject[];
}

interface CreateCategoryResponse {
  createCategory: CategoryObject;
}

interface UpdateCategoryResponse {
  updateCategory: CategoryObject;
}

interface CreateLocationResponse {
  createLocation: LocationObject;
}

interface UpdateLocationResponse {
  updateLocation: LocationObject;
}

interface CreateHashtagResponse {
  createHashtag: HashtagObject;
}

interface UpdateHashtagResponse {
  updateHashtag: HashtagObject;
}

interface FeedResponse {
  feed: {
    items: SocialPostResponse[];
    hasNextPage: boolean;
    endCursor: string | null;
  };
}


// ============================================================
// SERVICE
// ============================================================

@Injectable()
export class SocialGatewayService {
  constructor(
    private readonly httpService: HttpService,
  ) {}

  // ============================================================
  // CORE EXECUTE
  // ============================================================

  async execute<T>(
    query: string,
    variables: Record<string, unknown> = {},
    authorization?: string,
  ): Promise<T> {
    try {
      const response = await firstValueFrom(
        this.httpService.post<GraphQLResponse<T>>(
          SERVICE_URLS.SOCIAL,
          {
            query,
            variables,
          },
          {
            headers: authorization
              ? {
                  authorization,
                }
              : {},
          },
        ),
      );

      if (response.data.errors?.length) {
        throw new BadGatewayException(
          response.data.errors[0].message,
        );
      }

      return response.data.data;
      } catch (error: any) {
  console.error(
    '========== SOCIAL GATEWAY ERROR =========='
  );

  console.error('URL:', SERVICE_URLS.SOCIAL);

  console.error(
    'STATUS:',
    error?.response?.status,
  );

  console.error(
    'RESPONSE:',
    error?.response?.data,
  );

  console.error(
    'MESSAGE:',
    error?.message,
  );

  console.error(
    'CODE:',
    error?.code,
  );

  console.error(
    'ERROR:',
    error,
  );

  console.error(
    '==========================================='
  );

  if (error instanceof BadGatewayException) {
    throw error;
  }

  throw new BadGatewayException(
    error?.response?.data ||
      error?.message ||
      'Social service unavailable',
  );
}
    // } catch (error: unknown) {
    //   if (error instanceof BadGatewayException) {
    //     throw error;
    //   }

    //   throw new BadGatewayException(
    //     'Social service unavailable',
    //   );
    // }
  }

async createPost(
  input: CreatePostInput,
  authorization?: string,
): Promise<PostObject> {
  const data =
    await this.execute<CreatePostResponse>(
      `
      mutation CreatePost($input: CreatePostInput!) {
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

  return this.normalizePost(data.createPost);
}

async updatePost(
  input: UpdatePostInput,
  authorization?: string,
): Promise<PostObject> {
  const data =
    await this.execute<UpdatePostResponse>(
      `
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

  return this.normalizePost(data.updatePost);
}

  async deletePost(
    postId: string,
    authorization?: string,
  ): Promise<Pick<PostObject, 'id' | 'status'>> {
    const data =
      await this.execute<DeletePostResponse>(
        `
        mutation DeletePost($postId: ID!) {
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
    await this.execute<PostResponse>(
      `
      query Post($postId: ID!) {
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

  return this.normalizePost(data.post);
}

async posts(
  filter?: PostFilterInput,
  pagination?: PaginationInput,
  authorization?: string,
): Promise<PostListObject> {

  const data =
    await this.execute<PostsResponse>(
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
    '========== GATEWAY POSTS RESPONSE =========='
  );

  console.log(
    data.posts.items.map((post) => ({
      id: post.id,
      authorId: post.authorId,
      isPostLiked: post.isPostLiked,
      isPostSaved: post.isPostSaved,
      typeLiked: typeof post.isPostLiked,
      typeSaved: typeof post.isPostSaved,
    })),
  );

  console.log(
    '============================================='
  );

  return this.normalizePostList(data.posts);
}

  async viewPost(
    postId: string,
  ): Promise<Pick<PostObject, 'id' | 'viewCount'>> {
    const data =
      await this.execute<ViewPostResponse>(
        `
        mutation ViewPost($postId: ID!) {
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
    Pick<PostObject, 'id' | 'status' | 'updatedAt'>
  > {
    const data =
      await this.execute<ChangePostStatusResponse>(
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
    Pick<PostObject, 'id' | 'privacy' | 'updatedAt'>
  > {
    const data =
      await this.execute<ChangePostPrivacyResponse>(
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

  // ============================================================
  // LIKE
  // ============================================================

  async likePost(
    postId: string,
    authorization?: string,
  ): Promise<LikeObject> {
    const data =
      await this.execute<LikePostResponse>(
        `
        mutation LikePost($postId: ID!) {
          likePost(postId: $postId) {
            postId
            userId
            createdAt
          }
        }
        `,
        { postId },
        authorization,
      );

    return data.likePost;
  }

  async unlikePost(
    postId: string,
    authorization?: string,
  ): Promise<LikeObject> {
    const data =
      await this.execute<UnlikePostResponse>(
        `
        mutation UnlikePost($postId: ID!) {
          unlikePost(postId: $postId) {
            postId
            userId
            createdAt
          }
        }
        `,
        { postId },
        authorization,
      );

    return data.unlikePost;
  }

  async isPostLiked(
    postId: string,
    authorization?: string,
  ): Promise<boolean> {
    const data =
      await this.execute<IsPostLikedResponse>(
        `
        query IsPostLiked($postId: ID!) {
          isPostLiked(postId: $postId)
        }
        `,
        { postId },
        authorization,
      );

    return data.isPostLiked;
  }

  async likes(
    postId: string,
    pagination: PaginationInput,
    authorization?: string,
  ): Promise<LikeList> {
    const data =
      await this.execute<LikesResponse>(
        `
        query Likes(
          $postId: ID!
          $pagination: PaginationInput!
        ) {
          likes(
            postId: $postId
            pagination: $pagination
          ) {
            items {
              postId
              userId
              createdAt
            }
            total
            page
            limit
            totalPages
          }
        }
        `,
        {
          postId,
          pagination,
        },
        authorization,
      );

    return data.likes;
  }

  // ============================================================
  // SAVE
  // ============================================================

  async savePost(
    postId: string,
    authorization?: string,
  ): Promise<SavePostObject> {
    const data =
      await this.execute<SavePostResponse>(
        `
        mutation SavePost($postId: ID!) {
          savePost(postId: $postId) {
            postId
            userId
            savedAt
          }
        }
        `,
        { postId },
        authorization,
      );

    return data.savePost;
  }

  async unsavePost(
    postId: string,
    authorization?: string,
  ): Promise<SavePostObject> {
    const data =
      await this.execute<UnsavePostResponse>(
        `
        mutation UnsavePost($postId: ID!) {
          unsavePost(postId: $postId) {
            postId
            userId
            savedAt
          }
        }
        `,
        { postId },
        authorization,
      );

    return data.unsavePost;
  }

  async isPostSaved(
    postId: string,
    authorization?: string,
  ): Promise<boolean> {
    const data =
      await this.execute<IsPostSavedResponse>(
        `
        query IsPostSaved($postId: ID!) {
          isPostSaved(postId: $postId)
        }
        `,
        { postId },
        authorization,
      );

    return data.isPostSaved;
  }

  // ============================================================
  // COMMENT
  // ============================================================

  async createComment(
    input: CreateCommentInput,
    authorization?: string,
  ): Promise<CommentObject> {
    const data =
      await this.execute<CreateCommentResponse>(
        `
        mutation CreateComment(
          $input: CreateCommentInput!
        ) {
          createComment(input: $input) {
            id
            postId
            authorId
            parentCommentId
            content
            createdAt
          }
        }
        `,
        { input },
        authorization,
      );

    return data.createComment;
  }

  async updateComment(
    input: UpdateCommentInput,
    authorization?: string,
  ): Promise<CommentObject> {
    const data =
      await this.execute<UpdateCommentResponse>(
        `
        mutation UpdateComment(
          $input: UpdateCommentInput!
        ) {
          updateComment(input: $input) {
            id
            postId
            authorId
            parentCommentId
            content
            createdAt
          }
        }
        `,
        { input },
        authorization,
      );

    return data.updateComment;
  }

  async deleteComment(
    commentId: string,
    authorization?: string,
  ): Promise<boolean> {
    const data =
      await this.execute<DeleteCommentResponse>(
        `
        mutation DeleteComment($commentId: ID!) {
          deleteComment(commentId: $commentId)
        }
        `,
        { commentId },
        authorization,
      );

    return data.deleteComment;
  }

  async comments(
    postId: string,
    pagination: PaginationInput,
    authorization?: string,
  ): Promise<CommentList> {
    const data =
      await this.execute<CommentsResponse>(
        `
        query Comments(
          $postId: ID!
          $pagination: PaginationInput!
        ) {
          comments(
            postId: $postId
            pagination: $pagination
          ) {
            items {
              id
              postId
              authorId
              parentCommentId
              content
              createdAt
            }
            total
            page
            limit
            totalPages
          }
        }
        `,
        {
          postId,
          pagination,
        },
        authorization,
      );

    return data.comments;
  }

  async replies(
    commentId: string,
    authorization?: string,
  ): Promise<CommentObject[]> {
    const data =
      await this.execute<RepliesResponse>(
        `
        query Replies($commentId: ID!) {
          replies(commentId: $commentId) {
            id
            postId
            authorId
            parentCommentId
            content
            createdAt
          }
        }
        `,
        { commentId },
        authorization,
      );

    return data.replies;
  }

  // ============================================================
  // SHARE
  // ============================================================

  async sharePost(
    postId: string,
    authorization?: string,
  ): Promise<ShareObject> {
    const data =
      await this.execute<SharePostResponse>(
        `
        mutation SharePost($postId: ID!) {
          sharePost(postId: $postId) {
            id
            postId
            userId
            createdAt
          }
        }
        `,
        { postId },
        authorization,
      );

    return data.sharePost;
  }

  async shares(
    postId: string,
    pagination: PaginationInput,
    authorization?: string,
  ): Promise<ShareList> {
    const data =
      await this.execute<SharesResponse>(
        `
        query Shares(
          $postId: ID!
          $pagination: PaginationInput!
        ) {
          shares(
            postId: $postId
            pagination: $pagination
          ) {
            items {
              id
              postId
              userId
              createdAt
            }
            total
            page
            limit
            totalPages
          }
        }
        `,
        {
          postId,
          pagination,
        },
        authorization,
      );

    return data.shares;
  }

  // ============================================================
  // METADATA
  // ============================================================

  async categories(): Promise<CategoryObject[]> {
    const data =
      await this.execute<CategoriesResponse>(`
        query Categories {
          categories {
            id
            name
            description
          }
        }
      `);

    return data.categories;
  }

  async locations(): Promise<LocationObject[]> {
    const data =
      await this.execute<LocationsResponse>(`
        query Locations {
          locations {
            id
            name
            address
            latitude
            longitude
            province
          }
        }
      `);

    return data.locations;
  }

  async hashtags(): Promise<HashtagObject[]> {
    const data =
      await this.execute<HashtagsResponse>(`
        query Hashtags {
          hashtags {
            id
            name
          }
        }
      `);

    return data.hashtags;
  }

  async createCategory(
    input: CreateCategoryInput,
    authorization?: string,
  ): Promise<CategoryObject> {
    const data =
      await this.execute<CreateCategoryResponse>(
        `
        mutation CreateCategory(
          $input: CreateCategoryInput!
        ) {
          createCategory(input: $input) {
            id
            name
            description
          }
        }
        `,
        { input },
        authorization,
      );

    return data.createCategory;
  }

  async updateCategory(
    input: UpdateCategoryInput,
    authorization?: string,
  ): Promise<CategoryObject> {
    const data =
      await this.execute<UpdateCategoryResponse>(
        `
        mutation UpdateCategory(
          $input: UpdateCategoryInput!
        ) {
          updateCategory(input: $input) {
            id
            name
            description
          }
        }
        `,
        { input },
        authorization,
      );

    return data.updateCategory;
  }

  async createLocation(
    input: CreateLocationInput,
    authorization?: string,
  ): Promise<LocationObject> {
    const data =
      await this.execute<CreateLocationResponse>(
        `
        mutation CreateLocation(
          $input: CreateLocationInput!
        ) {
          createLocation(input: $input) {
            id
            name
            address
            latitude
            longitude
            province
          }
        }
        `,
        { input },
        authorization,
      );

    return data.createLocation;
  }

  async updateLocation(
    input: UpdateLocationInput,
    authorization?: string,
  ): Promise<LocationObject> {
    const data =
      await this.execute<UpdateLocationResponse>(
        `
        mutation UpdateLocation(
          $input: UpdateLocationInput!
        ) {
          updateLocation(input: $input) {
            id
            name
            address
            latitude
            longitude
            province
          }
        }
        `,
        { input },
        authorization,
      );

    return data.updateLocation;
  }

  async createHashtag(
    input: CreateHashtagInput,
    authorization?: string,
  ): Promise<HashtagObject> {
    const data =
      await this.execute<CreateHashtagResponse>(
        `
        mutation CreateHashtag(
          $input: CreateHashtagInput!
        ) {
          createHashtag(input: $input) {
            id
            name
          }
        }
        `,
        { input },
        authorization,
      );

    return data.createHashtag;
  }

  async updateHashtag(
    input: UpdateHashtagInput,
    authorization?: string,
  ): Promise<HashtagObject> {
    const data =
      await this.execute<UpdateHashtagResponse>(
        `
        mutation UpdateHashtag(
          $input: UpdateHashtagInput!
        ) {
          updateHashtag(input: $input) {
            id
            name
          }
        }
        `,
        { input },
        authorization,
      );

    return data.updateHashtag;
  }

  private normalizePost(
  post: SocialPostResponse,
): PostObject {
  return {
    ...post,
    createdAt: new Date(post.createdAt),
    updatedAt: new Date(post.updatedAt),
  };
}

private normalizePostList(
  posts: {
    items: SocialPostResponse[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  },
): PostListObject {
  return {
    ...posts,
    items: posts.items.map((post) =>
      this.normalizePost(post),
    ),
  };
}

async feed(
  input: FeedInput,
  authorization?: string,
): Promise<FeedPageObject> {
  const data =
    await this.execute<FeedResponse>(
      `
      query Feed($input: FeedInput!) {
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
      `,
      {
        input: {
          cursor: input.cursor,
          limit: input.limit ?? 10,
        },
      },
      authorization,
    );

  return {
    ...data.feed,
    items: data.feed.items.map((post) =>
      this.normalizePost(post),
    ),
  };
}



}