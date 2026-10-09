import { Args, Context, ID, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { SocialGatewayService } from './social.gateway.service';
import { PostObject, PostListObject, PostPrivacy, PostStatus } from './post/types/post.types';
import { CreatePostInput, UpdatePostInput, PostFilterInput, PaginationInput } from './post/dto/post.inputs';
import { LikeObject, LikeList, SavePostObject, ShareObject, ShareList } from './interaction/types/interaction.types';
import { FeedInput } from './post/dto/feed.inputs';
import { FeedPageObject } from './post/types/feed.types';
import { FileUpload, GraphQLUpload } from 'graphql-upload-ts';


@Resolver()
export class SocialGatewayResolver {
  constructor(
    private readonly socialGatewayService: SocialGatewayService,
  ) {}

  private getAuthorization(context: any): string | undefined {
    return context?.req?.headers?.authorization;
  }

  @Mutation(() => PostObject)
  createPost(
    @Args('input') input: CreatePostInput,
    @Context() context: any) {
    return this.socialGatewayService.createPost(
      input,
      this.getAuthorization(context),
    );
  }

  @Mutation(() => PostObject)
  updatePost(
    @Args('input') input: UpdatePostInput,
    @Context() context: any) {
    return this.socialGatewayService.updatePost(
      input,
      this.getAuthorization(context),
    );
  }


  @Mutation(() => PostObject)
  createPostWithFiles(
    @Args('input') input: CreatePostInput,
    @Args({
      name: 'files',
      type: () => [GraphQLUpload],
      nullable: true,
    }) files: Promise<FileUpload>[] | undefined,
    @Context() context: any,
  ) {
    return this.socialGatewayService.createPostWithFiles(
      input,
      files,
      this.getAuthorization(context),
    );
  }

  @Mutation(() => PostObject)
  updatePostWithFiles(
    @Args('input') input: UpdatePostInput,
    @Args({
      name: 'files',
      type: () => [GraphQLUpload],
      nullable: true,
    })
    files: Promise<FileUpload>[] | undefined,
    @Context() context: any) {
    return this.socialGatewayService.updatePostWithFiles(
      input,
      files,
      this.getAuthorization(context),
    );
  }


  @Mutation(() => PostObject)
  deletePost( @Args('postId', { type: () => ID }) postId: string,
    @Context() context: any) {
    return this.socialGatewayService.deletePost(
      postId,
      this.getAuthorization(context),
    );
  }

  @Query(() => PostObject)
  post( @Args('postId', { type: () => ID }) postId: string,
    @Context() context: any) {
    return this.socialGatewayService.post(
      postId,
      this.getAuthorization(context),
    );
  }

  @Query(() => PostListObject)
  posts( @Args('filter', {
      type: () => PostFilterInput,
      nullable: true,
    })
    filter: PostFilterInput | undefined,
    @Args('pagination', { type: () => PaginationInput, nullable: true }) pagination: PaginationInput | undefined,
    @Context() context: any) {
    return this.socialGatewayService.posts(
      filter,
      pagination,
      this.getAuthorization(context),
    );
  }

  @Query(() => PostListObject)
  searchPosts(
  @Args('keyword', { type: () => String }) keyword: string,
  @Args('page', { type: () => Int,
    nullable: true,
    defaultValue: 1,
  }) page: number,

  @Args('limit', {
    type: () => Int,
    nullable: true,
    defaultValue: 20,
  }) limit: number,
  @Context() context: any) {
    return this.socialGatewayService.searchPosts(
      keyword,
      page,
      limit,
      this.getAuthorization(context),
    );
  }

@Mutation(() => PostObject)
async viewPost(
  @Args('postId', { type: () => ID }) postId: string,
  @Context() context: any,
) {
  const authorization = context.req.headers.authorization;

  return this.socialGatewayService.viewPost(
    postId,
    authorization,
  );
}

  @Mutation(() => PostObject)
  changePostStatus(
    @Args('postId', { type: () => ID }) postId: string,
    @Args('newStatus', {
      type: () => PostStatus,
    }) newStatus: PostStatus,
    @Context() context: any) {
    return this.socialGatewayService.changePostStatus(
      postId,
      newStatus,
      this.getAuthorization(context),
    );
  }

  @Mutation(() => PostObject)
  changePostPrivacy(
    @Args('postId', { type: () => ID }) postId: string,
    @Args('newPrivacy', {
      type: () => PostPrivacy,
    }) newPrivacy: PostPrivacy,
    @Context() context: any,
  ) {
    return this.socialGatewayService.changePostPrivacy(
      postId,
      newPrivacy,
      this.getAuthorization(context),
    );
  }


  @Mutation(() => LikeObject)
  likePost(
    @Args('postId', { type: () => ID }) postId: string,
    @Context() context: any,
  ) {
    return this.socialGatewayService.likePost(
      postId,
      this.getAuthorization(context),
    );
  }

  @Mutation(() => LikeObject)
  unlikePost(
    @Args('postId', { type: () => ID }) postId: string,
    @Context() context: any,
  ) {
    return this.socialGatewayService.unlikePost(
      postId,
      this.getAuthorization(context),
    );
  }

  @Query(() => Boolean)
  isPostLiked(
    @Args('postId', { type: () => ID }) postId: string,
    @Context() context: any,
  ) {
    return this.socialGatewayService.isPostLiked(
      postId,
      this.getAuthorization(context),
    );
  }

  @Query(() => LikeList)
  likes(
    @Args('postId', { type: () => ID }) postId: string,

    @Args('pagination', {
      type: () => PaginationInput,
    })
    pagination: PaginationInput,

    @Context() context: any,
  ) {
    return this.socialGatewayService.likes(
      postId,
      pagination,
      this.getAuthorization(context),
    );
  }

  @Mutation(() => SavePostObject)
  savePost(
    @Args('postId', { type: () => ID }) postId: string,
    @Context() context: any,
  ) {
    return this.socialGatewayService.savePost(
      postId,
      this.getAuthorization(context),
    );
  }

  @Mutation(() => SavePostObject)
  unsavePost(
    @Args('postId', { type: () => ID }) postId: string,
    @Context() context: any,
  ) {
    return this.socialGatewayService.unsavePost(
      postId,
      this.getAuthorization(context),
    );
  }

  @Query(() => Boolean)
  isPostSaved(
    @Args('postId', { type: () => ID }) postId: string,
    @Context() context: any,
  ) {
    return this.socialGatewayService.isPostSaved(
      postId,
      this.getAuthorization(context),
    );
  }

  @Mutation(() => ShareObject)
  sharePost(
    @Args('postId', { type: () => ID }) postId: string,
    @Context() context: any,
  ) {
    return this.socialGatewayService.sharePost(
      postId,
      this.getAuthorization(context),
    );
  }

  @Query(() => ShareList)
  shares(
    @Args('postId', { type: () => ID }) postId: string,

    @Args('pagination', {
      type: () => PaginationInput,
    })
    pagination: PaginationInput,

    @Context() context: any,
  ) {
    return this.socialGatewayService.shares(
      postId,
      pagination,
      this.getAuthorization(context),
    );
  }



  @Query(() => FeedPageObject)
feed(
  @Args('input', { type: () => FeedInput })
  input: FeedInput,

  @Context() context: any,
) {
  return this.socialGatewayService.feed(
    input,
    this.getAuthorization(context),
  );
}


  @Query(() => PostListObject)
savedPosts(
  @Args('profileId', { type: () => ID }) profileId: string,
  @Args('pagination', { type: () => PaginationInput })
  pagination: PaginationInput,
  @Context() context: any,
) {
  return this.socialGatewayService.savedPosts(
    profileId,
    pagination,
    this.getAuthorization(context),
  );
}


@Query(() => PostListObject)
async profilePosts(
  @Args('profileId', { type: () => ID }) profileId: string,
  @Args('page', {
    type: () => Int,
    nullable: true,
    defaultValue: 1,
  }) page: number,
  @Args('limit', {
    type: () => Int,
    nullable: true,
    defaultValue: 10,
  }) limit: number,
  @Context() context: any,
): Promise<PostListObject> {
  const authorization = context.req.headers.authorization;

  return this.socialGatewayService.profilePosts(
    profileId,
    page,
    limit,
    authorization,
  );
}


@Query(() => PostListObject)
async myDraftPosts(
  @Args('page', {
    type: () => Int,
    nullable: true,
    defaultValue: 1,
  }) page: number,
  @Args('limit', {
    type: () => Int,
    nullable: true,
    defaultValue: 10,
  }) limit: number,
  @Context() context: any,
): Promise<PostListObject> {
  const authorization = context.req.headers.authorization;

  return this.socialGatewayService.myDraftPosts(
    page,
    limit,
    authorization,
  );
}

}