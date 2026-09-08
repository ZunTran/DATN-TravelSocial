import {  Args,  Context,  ID,  Mutation,  Parent,  Query,  ResolveField,  Resolver} from '@nestjs/graphql';
import { PostService } from './post.service';
import { PostObject } from './objects/post.object';
import { PostListObject } from './objects/post-list.object';
import { CreatePostInput } from './dto/create-post.input';
import { UpdatePostInput } from './dto/update-post.input';
import { PostFilterInput } from './dto/post-filter.input';
import { PaginationInput } from '../../common/dto/pagination.input';
import { CurrentUser } from '../../common/auth/decorators/current-user.decorator';
import type { ActiveUserData } from '../../common/auth/interfaces/user-data.interface';
import { FileUpload, GraphQLUpload } from 'graphql-upload-ts';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/auth/guards/jwt-auth.guard';
import { PostPrivacy, PostStatus } from '@prisma/client';
import { FeedPageObject } from './objects/feed-page.object';
import { FeedInput } from './dto/feed.input';

@Resolver(() => PostObject)
export class PostResolver {
  constructor(
    private readonly postService: PostService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Mutation(() => PostObject)
  async createPost(@CurrentUser() user: ActiveUserData,
  @Args('input') input: CreatePostInput) {
    return this.postService.createPost(user.accountId,input);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => PostObject)
  async updatePost(@CurrentUser() user: ActiveUserData,
  @Args('input') input: UpdatePostInput) {
    return this.postService.updatePost(user.accountId,input);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => PostObject)
  async deletePost(@CurrentUser() user: ActiveUserData,
  @Args('postId', {type: () => ID}) postId: string,) {
    return this.postService.deletePost(user.accountId,postId);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => PostObject)
  async post(@CurrentUser() user: ActiveUserData,
    @Args('postId', {type: () => ID}) postId: string) {
    return this.postService.getPost(postId,user.accountId);
  }


  @UseGuards(JwtAuthGuard)
  @Query(() => PostListObject)
  async posts(
    @CurrentUser() user: ActiveUserData,

    @Args('filter', {
      type: () => PostFilterInput,
      nullable: true,
    })
    filter?: PostFilterInput,

    @Args('pagination', {
      type: () => PaginationInput,
      nullable: true,
    })
    pagination?: PaginationInput,
  ) {
    return this.postService.getPosts(
      user.accountId,
      filter ?? {},
      pagination?.page ?? 1,
      pagination?.limit ?? 20,
    );
  }

  @Mutation(() => PostObject)
  async viewPost(@Args('postId', {type: () => ID}) postId: string) {
    return this.postService.incrementView(postId);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => PostObject)
  async createPostWithFiles(
    @CurrentUser() user: ActiveUserData,
    @Args('input') input: CreatePostInput,
    @Args({name: 'files',type: () => [GraphQLUpload],nullable: true})
    files?: Promise<FileUpload>[]) {
    return this.postService.createPostWithFiles(user.accountId,input,files,);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => PostObject)
  async updatePostWithFiles(@CurrentUser() user: ActiveUserData,
    @Args('input') input: UpdatePostInput,
    @Args({name: 'files',type: () => [GraphQLUpload],nullable: true}) files?: Promise<FileUpload>[]) {
    return this.postService.updatePostWithFiles(user.accountId,input,files);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => PostObject)
  async changePostStatus(@CurrentUser() user: ActiveUserData,
  @Args('postId', { type: () => ID }) postId: string,
  @Args('newStatus', { type: () => PostStatus }) newStatus: PostStatus,) {
    return await this.postService.changePostStatus(
      user.accountId,
      postId,
      newStatus,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => PostObject)
  async changePostPrivacy(@CurrentUser() user: ActiveUserData,
  @Args('postId', { type: () => ID }) postId: string,
  @Args('newPrivacy', { type: () => PostPrivacy }) newPrivacy: PostPrivacy) {
    return await this.postService.changePostPrivacy(
      user.accountId,
      postId,
      newPrivacy,
    );
  }

  @Query(() => FeedPageObject)
  @UseGuards(JwtAuthGuard)
  async feed( @CurrentUser() user: ActiveUserData,
    @Args('input', { type: () => FeedInput }) input: FeedInput) {
    return this.postService.getFeed(
      user.accountId,
      input.cursor,
      input.limit,
    );
  }

  
}