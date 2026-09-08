import { Args,ID,Mutation,Parent,Query,ResolveField,Resolver,} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/auth/decorators/current-user.decorator';
import type { ActiveUserData } from '../../common/auth/interfaces/user-data.interface';
import { LikeService } from './like/like.service';
import { CommentService } from './comment/comment.service';
import { SavePostService } from './save-post/save-post.service';
import { ShareService } from './share/share.service';
import { LikeObject } from './like/objects/like.object';
import { CommentObject } from './comment/objects/comment.object';
import { SavePostObject } from './save-post/objects/save-post.object';
import { ShareObject } from './share/objects/share.object';

import { CreateCommentInput } from './comment/dto/create-comment.input';
import { UpdateCommentInput } from './comment/dto/update-comment.input';
import { PaginationInput } from '../../common/dto/pagination.input';
import { CommentList } from './comment/objects/comment-list.object';
import { LikeList } from './like/objects/like-list.object';
import { ShareList } from './share/objects/share-list.object';
import { PostListObject } from '../post/objects/post-list.object';

@Resolver()
export class InteractionResolver {
  constructor(
    private readonly likeService: LikeService,
    private readonly commentService: CommentService,
    private readonly savePostService: SavePostService,
    private readonly shareService: ShareService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Mutation(() => LikeObject)
  async likePost(
    @CurrentUser() user: ActiveUserData,
    @Args('postId', { type: () => ID }) postId: string) {
    return this.likeService.like( postId, user.accountId );
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => LikeObject)
  async unlikePost(
    @CurrentUser() user: ActiveUserData,
    @Args('postId', { type: () => ID }) postId: string) {
      return this.likeService.unlike( postId, user.accountId);
  }


  @UseGuards(JwtAuthGuard)
  @Mutation(() => CommentObject)
  async createComment(
    @CurrentUser() user: ActiveUserData,
    @Args('input') input: CreateCommentInput) {
      return this.commentService.create(user.accountId, input);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => CommentObject)
  async updateComment(
    @CurrentUser() user: ActiveUserData,
    @Args('input') input: UpdateCommentInput) {
      return this.commentService.update(user.accountId, input);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean)
  async deleteComment(
    @CurrentUser() user: ActiveUserData,
    @Args('commentId', { type: () => ID }) commentId: string) {
      return this.commentService.delete(user.accountId, commentId);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => CommentList)
  async comments(
    @Args('postId', { type: () => ID }) postId: string,
    @Args('pagination', { type: () => PaginationInput })
    pagination: PaginationInput) {
      return this.commentService.getComments( postId, pagination);
}

  @UseGuards(JwtAuthGuard)
  @Query(() => [CommentObject])
  async replies(
    @Args('commentId', { type: () => ID }) commentId: string) {
      return this.commentService.getReplies(commentId);
  }


  @UseGuards(JwtAuthGuard)
  @Mutation(() => SavePostObject)
  async savePost(
    @CurrentUser() user: ActiveUserData,
    @Args('postId', { type: () => ID }) postId: string) {
      return this.savePostService.save(postId, user.accountId);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => SavePostObject)
  async unsavePost(
    @CurrentUser() user: ActiveUserData,
    @Args('postId', { type: () => ID }) postId: string) {
      return this.savePostService.unsave(postId, user.accountId);
  }


  @UseGuards(JwtAuthGuard)
  @Mutation(() => ShareObject)
  async sharePost(
    @CurrentUser() user: ActiveUserData,
    @Args('postId', { type: () => ID }) postId: string) {
      return this.shareService.share(postId, user.accountId);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => LikeList)
  async likes( @Args('postId', { type: () => ID }) postId: string,
    @Args('pagination', { type: () => PaginationInput })
    pagination: PaginationInput,) {
      return this.likeService.getLikes( postId, pagination);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => ShareList)
  async shares(
    @Args('postId', { type: () => ID }) postId: string,
    @Args('pagination', { type: () => PaginationInput })
    pagination: PaginationInput) {
      return this.shareService.getShares( postId, pagination);
  }

  @UseGuards(JwtAuthGuard)
@Query(() => PostListObject)
async savedPosts(
  @CurrentUser() user: ActiveUserData,
  @Args('pagination', { type: () => PaginationInput })
  pagination: PaginationInput,
) {
  return this.savePostService.getSavedPosts(
    user.accountId,
    pagination.page,
    pagination.limit,
  );
}

}