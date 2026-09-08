import { Args, Context, ID, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { SocialGatewayService } from './social.gateway.service';
import { PostObject, PostListObject, PostPrivacy, PostStatus } from './post/types/post.types';
import { CreatePostInput, UpdatePostInput, PostFilterInput, PaginationInput } from './post/dto/post.inputs';
import { LikeObject, LikeList, CommentObject, CommentList, SavePostObject, ShareObject, ShareList } from './interaction/types/interaction.types';
import { CreateCommentInput, UpdateCommentInput } from './interaction/dto/interaction.inputs';
import { CategoryObject, LocationObject, HashtagObject } from './metadata/types/metadata.types';
import { CreateCategoryInput, UpdateCategoryInput, CreateLocationInput, UpdateLocationInput, CreateHashtagInput, UpdateHashtagInput } from './metadata/dto/metadata.inputs';
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

  @Mutation(() => PostObject)
  viewPost(
    @Args('postId', { type: () => ID }) postId: string ) {
    return this.socialGatewayService.viewPost(postId);
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


  @Mutation(() => CommentObject)
  createComment(
    @Args('input') input: CreateCommentInput,
    @Context() context: any,
  ) {
    return this.socialGatewayService.createComment(
      input,
      this.getAuthorization(context),
    );
  }

  @Mutation(() => CommentObject)
  updateComment(
    @Args('input') input: UpdateCommentInput,
    @Context() context: any,
  ) {
    return this.socialGatewayService.updateComment(
      input,
      this.getAuthorization(context),
    );
  }

  @Mutation(() => Boolean)
  deleteComment(
    @Args('commentId', { type: () => ID }) commentId: string,
    @Context() context: any,
  ) {
    return this.socialGatewayService.deleteComment(
      commentId,
      this.getAuthorization(context),
    );
  }

  @Query(() => CommentList)
  comments(
    @Args('postId', { type: () => ID }) postId: string,

    @Args('pagination', {
      type: () => PaginationInput,
    })
    pagination: PaginationInput,

    @Context() context: any,
  ) {
    return this.socialGatewayService.comments(
      postId,
      pagination,
      this.getAuthorization(context),
    );
  }

  @Query(() => [CommentObject])
  replies(
    @Args('commentId', { type: () => ID }) commentId: string,
    @Context() context: any,
  ) {
    return this.socialGatewayService.replies(
      commentId,
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


  @Query(() => [CategoryObject])
  categories() {
    return this.socialGatewayService.categories();
  }

  @Query(() => [LocationObject])
  locations() {
    return this.socialGatewayService.locations();
  }

  @Query(() => [HashtagObject])
  hashtags() {
    return this.socialGatewayService.hashtags();
  }

  @Mutation(() => CategoryObject)
  createCategory(
    @Args('input') input: CreateCategoryInput,
    @Context() context: any,
  ) {
    return this.socialGatewayService.createCategory(
      input,
      this.getAuthorization(context),
    );
  }

  @Mutation(() => CategoryObject)
  updateCategory(
    @Args('input') input: UpdateCategoryInput,
    @Context() context: any,
  ) {
    return this.socialGatewayService.updateCategory(
      input,
      this.getAuthorization(context),
    );
  }

  @Mutation(() => CategoryObject)
  createLocation(
    @Args('input') input: CreateLocationInput,
    @Context() context: any,
  ) {
    return this.socialGatewayService.createLocation(
      input,
      this.getAuthorization(context),
    );
  }

  @Mutation(() => LocationObject)
  updateLocation(
    @Args('input') input: UpdateLocationInput,
    @Context() context: any,
  ) {
    return this.socialGatewayService.updateLocation(
      input,
      this.getAuthorization(context),
    );
  }

  @Mutation(() => HashtagObject)
  createHashtag(
    @Args('input') input: CreateHashtagInput,
    @Context() context: any,
  ) {
    return this.socialGatewayService.createHashtag(
      input,
      this.getAuthorization(context),
    );
  }

  @Mutation(() => HashtagObject)
  updateHashtag(
    @Args('input') input: UpdateHashtagInput,
    @Context() context: any,
  ) {
    return this.socialGatewayService.updateHashtag(
      input,
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
  @Args('pagination', {
    type: () => PaginationInput,
  })
  pagination: PaginationInput,

  @Context() context: any,
) {
  return this.socialGatewayService.savedPosts(
    pagination,
    this.getAuthorization(context),
  );
}

}