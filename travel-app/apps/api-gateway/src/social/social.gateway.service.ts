import { Injectable } from '@nestjs/common';
import { PostGatewayService } from './post/post-gateway.service';
import { FeedGatewayService } from './post/feed-gateway.service';
import { LikeGatewayService } from './interaction/like.gateway.service';
import { SaveGatewayService } from './interaction/save.gateway.service';
import { ShareGatewayService } from './interaction/share.gateway.service';
import { CreatePostInput, PaginationInput, PostFilterInput, UpdatePostInput } from './post/dto/post.inputs';
import { PostListObject, PostObject, PostPrivacy, PostStatus } from './post/types/post.types';
import { FeedInput } from './post/dto/feed.inputs';
import { FeedPageObject } from './post/types/feed.types';
import { LikeList, LikeObject, SavePostObject, ShareList, ShareObject } from './interaction/types/interaction.types';
import type { FileUpload } from 'graphql-upload-ts';

@Injectable()
export class SocialGatewayService {
  constructor(
    private readonly postGateway: PostGatewayService,
    private readonly feedGateway: FeedGatewayService,
    private readonly likeGateway: LikeGatewayService,
    private readonly saveGateway: SaveGatewayService,
    private readonly shareGateway: ShareGatewayService,
    // private readonly hashtagGateway: HashtagGatewayService,
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

  profilePosts(
  profileId: string,
  page = 1,
  limit = 10,
  authorization?: string,
): Promise<PostListObject> {
  return this.postGateway.profilePosts(
    profileId,
    page,
    limit,
    authorization,
  );
}

myDraftPosts(
  page = 1,
  limit = 10,
  authorization?: string,
): Promise<PostListObject> {
  return this.postGateway.myDraftPosts(
    page,
    limit,
    authorization,
  );
}

  searchPosts(
  keyword: string,
  page: number,
  limit: number,
  authorization?: string): Promise<PostListObject> {
    return this.postGateway.searchPosts(
      keyword,
      page,
      limit,
      authorization,
    );
  }

viewPost(
  postId: string,
  authorization?: string,
): Promise<Pick<PostObject, 'id' | 'viewCount'>> {
  return this.postGateway.viewPost(
    postId,
    authorization,
  );
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

  savedPosts(  profileId: string,
    pagination: PaginationInput,
    authorization?: string,
  ): Promise<PostListObject> {
    return this.saveGateway.savedPosts(
      profileId,
      pagination,
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

}