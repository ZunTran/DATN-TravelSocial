import { Injectable } from '@nestjs/common';
import { PostGatewayService } from './post/post-gateway.service';
import { FeedGatewayService } from './post/feed-gateway.service';
import { LikeGatewayService } from './interaction/like-gateway.service';
import { SaveGatewayService } from './interaction/save-gateway.service';
import { CommentGatewayService } from './interaction/comment-gateway.service';

import { ShareGatewayService } from './interaction/share-gateway.service';
import { CategoryGatewayService } from './metadata/category-gateway.service';
import { LocationGatewayService } from './metadata/location-gateway.service';

import { HashtagGatewayService } from './metadata/hashtag-gateway.service';
import { CreatePostInput, PaginationInput, PostFilterInput, UpdatePostInput } from './post/dto/post.inputs';
import { PostListObject, PostObject, PostPrivacy, PostStatus } from './post/types/post.types';
import { FeedInput } from './post/dto/feed.inputs';
import { FeedPageObject } from './post/types/feed.types';
import { CommentList, CommentObject, LikeList, LikeObject, SavePostObject, ShareList, ShareObject } from './interaction/types/interaction.types';
import { CreateCommentInput, UpdateCommentInput } from './interaction/dto/interaction.inputs';

import { CreateCategoryInput, CreateHashtagInput, CreateLocationInput, UpdateCategoryInput, UpdateHashtagInput, UpdateLocationInput } from './metadata/dto/metadata.inputs';
import { CategoryObject, HashtagObject, LocationObject } from './metadata/types/metadata.types';
import type { FileUpload } from 'graphql-upload-ts';
@Injectable()
export class SocialGatewayService {
  constructor(
    private readonly postGateway: PostGatewayService,
    private readonly feedGateway: FeedGatewayService,
    private readonly likeGateway: LikeGatewayService,
    private readonly saveGateway: SaveGatewayService,
    private readonly commentGateway: CommentGatewayService,
    private readonly shareGateway: ShareGatewayService,
    private readonly categoryGateway: CategoryGatewayService,
    private readonly locationGateway: LocationGatewayService,
    private readonly hashtagGateway: HashtagGatewayService,
  ) {}

  createPost( input: CreatePostInput, authorization?: string ): Promise<PostObject> {
    return this.postGateway.createPost(
      input,
      authorization,
    );
  }

  updatePost( input: UpdatePostInput, authorization?: string ): Promise<PostObject> {
    return this.postGateway.updatePost(
      input,
      authorization,
    );
  }

  createPostWithFiles(
  input: CreatePostInput,
  files?: Promise<FileUpload>[],
  authorization?: string,
): Promise<PostObject> {
  return this.postGateway.createPostWithFiles(
    input,
    files,
    authorization,
  );
}

  updatePostWithFiles(
    input: UpdatePostInput,
    files?: Promise<FileUpload>[],
    authorization?: string,
  ): Promise<PostObject> {
    return this.postGateway.updatePostWithFiles(
      input,
      files,
      authorization,
    );
  }

  deletePost( postId: string, authorization?: string ): Promise< Pick<PostObject, 'id' | 'status'>
> {
    return this.postGateway.deletePost(
      postId,
      authorization,
    );
  }

  post( postId: string, authorization?: string ): Promise<PostObject> {
    return this.postGateway.post(
      postId,
      authorization,
    );
  }

  posts( filter?: PostFilterInput, pagination?: PaginationInput, authorization?: string ): Promise<PostListObject> {
    return this.postGateway.posts(
      filter,
      pagination,
      authorization,
    );
  }

  viewPost( postId: string ): Promise < Pick<PostObject, 'id' | 'viewCount'>
  > {
    return this.postGateway.viewPost( postId );
  }

  changePostStatus( postId: string,  newStatus: PostStatus, authorization?: string,
  ): Promise< Pick < PostObject, 'id' | 'status' | 'updatedAt'>
  > {
    return this.postGateway.changePostStatus(
      postId,
      newStatus,
      authorization,
    );
  }

  changePostPrivacy(
    postId: string,
    newPrivacy: PostPrivacy,
    authorization?: string,
  ): Promise<
    Pick<
      PostObject,
      'id' | 'privacy' | 'updatedAt'
    >
  > {
    return this.postGateway.changePostPrivacy(
      postId,
      newPrivacy,
      authorization,
    );
  }


  feed(
    input: FeedInput,
    authorization?: string,
  ): Promise<FeedPageObject> {
    return this.feedGateway.feed(
      input,
      authorization,
    );
  }


  // LIKE
  likePost(
    postId: string,
    authorization?: string,
  ): Promise<LikeObject> {
    return this.likeGateway.likePost(
      postId,
      authorization,
    );
  }

  unlikePost(
    postId: string,
    authorization?: string,
  ): Promise<LikeObject> {
    return this.likeGateway.unlikePost(
      postId,
      authorization,
    );
  }

  isPostLiked(
    postId: string,
    authorization?: string,
  ): Promise<boolean> {
    return this.likeGateway.isPostLiked(
      postId,
      authorization,
    );
  }

  likes(
    postId: string,
    pagination: PaginationInput,
    authorization?: string,
  ): Promise<LikeList> {
    return this.likeGateway.likes(
      postId,
      pagination,
      authorization,
    );
  }

  // SAVE
  savePost(
    postId: string,
    authorization?: string,
  ): Promise<SavePostObject> {
    return this.saveGateway.savePost(
      postId,
      authorization,
    );
  }

  unsavePost(
    postId: string,
    authorization?: string,
  ): Promise<SavePostObject> {
    return this.saveGateway.unsavePost(
      postId,
      authorization,
    );
  }

  isPostSaved(
    postId: string,
    authorization?: string,
  ): Promise<boolean> {
    return this.saveGateway.isPostSaved(
      postId,
      authorization,
    );
  }

  savedPosts(
    pagination: PaginationInput,
    authorization?: string,
  ): Promise<PostListObject> {
    return this.saveGateway.savedPosts(
      pagination,
      authorization,
    );
  }

  createComment(
    input: CreateCommentInput,
    authorization?: string,
  ): Promise<CommentObject> {
    return this.commentGateway.createComment(
      input,
      authorization,
    );
  }

  updateComment(
    input: UpdateCommentInput,
    authorization?: string,
  ): Promise<CommentObject> {
    return this.commentGateway.updateComment(
      input,
      authorization,
    );
  }

  deleteComment(
    commentId: string,
    authorization?: string,
  ): Promise<boolean> {
    return this.commentGateway.deleteComment(
      commentId,
      authorization,
    );
  }

  comments(
    postId: string,
    pagination: PaginationInput,
    authorization?: string,
  ): Promise<CommentList> {
    return this.commentGateway.comments(
      postId,
      pagination,
      authorization,
    );
  }

  replies(
    commentId: string,
    authorization?: string,
  ): Promise<CommentObject[]> {
    return this.commentGateway.replies(
      commentId,
      authorization,
    );
  }


  sharePost(
    postId: string,
    authorization?: string,
  ): Promise<ShareObject> {
    return this.shareGateway.sharePost(
      postId,
      authorization,
    );
  }

  shares(
    postId: string,
    pagination: PaginationInput,
    authorization?: string,
  ): Promise<ShareList> {
    return this.shareGateway.shares(
      postId,
      pagination,
      authorization,
    );
  }


  categories(): Promise<CategoryObject[]> {
    return this.categoryGateway.categories();
  }

  createCategory(
    input: CreateCategoryInput,
    authorization?: string,
  ): Promise<CategoryObject> {
    return this.categoryGateway.createCategory(
      input,
      authorization,
    );
  }

  updateCategory(
    input: UpdateCategoryInput,
    authorization?: string,
  ): Promise<CategoryObject> {
    return this.categoryGateway.updateCategory(
      input,
      authorization,
    );
  }

  locations(): Promise<LocationObject[]> {
    return this.locationGateway.locations();
  }

  createLocation(
    input: CreateLocationInput,
    authorization?: string,
  ): Promise<LocationObject> {
    return this.locationGateway.createLocation(
      input,
      authorization,
    );
  }

  updateLocation(
    input: UpdateLocationInput,
    authorization?: string,
  ): Promise<LocationObject> {
    return this.locationGateway.updateLocation(
      input,
      authorization,
    );
  }

  // HASHTAG
  hashtags(): Promise<HashtagObject[]> {
    return this.hashtagGateway.hashtags();
  }

  createHashtag(
    input: CreateHashtagInput,
    authorization?: string,
  ): Promise<HashtagObject> {
    return this.hashtagGateway.createHashtag(
      input,
      authorization,
    );
  }

  updateHashtag(
    input: UpdateHashtagInput,
    authorization?: string,
  ): Promise<HashtagObject> {
    return this.hashtagGateway.updateHashtag(
      input,
      authorization,
    );
  }

  
}