import {
  Args,
  Context,
  ID,
  Mutation,
  Query,
  Resolver,
} from '@nestjs/graphql';
import { UnauthorizedException } from '@nestjs/common';

import {
  GatewayCommentListObject,
  GatewayCommentObject,
} from './objects/comment.object';

import { CommentGatewayService } from './comment.gateway.service';

import {
  GatewayCreateCommentInput,
  GatewayUpdateCommentInput,
} from './dto/comment.input';
import { PaginationInput } from '../../post/dto/post.inputs';


@Resolver(() => GatewayCommentObject)
export class CommentGatewayResolver {
  constructor(
    private readonly commentGatewayService: CommentGatewayService,
  ) {}

  private getAuthorization(context: any): string {
    const authorization = context?.req?.headers?.authorization;

    if (!authorization) {
      throw new UnauthorizedException(
        'Missing authorization header',
      );
    }

    return authorization;
  }


  @Query(() => GatewayCommentListObject)
  async comments(
    @Args('postId', {
      type: () => ID,
    })
    postId: string,

    @Args('pagination', {
      type: () => PaginationInput,
      nullable: true,
    })
    pagination?: PaginationInput,

    @Context() context?: any,
  ) {
    return this.commentGatewayService.getComments(
      postId,
      pagination ?? {
        page: 1,
        limit: 10,
      },
      this.getAuthorization(context),
    );
  }

  @Mutation(() => GatewayCommentObject)
  async createComment(
    @Args('input', {
      type: () => GatewayCreateCommentInput,
    })
    input: GatewayCreateCommentInput,

    @Context() context?: any,
  ) {
    return this.commentGatewayService.createComment(
      input,
      this.getAuthorization(context),
    );
  }

  @Query(() => [GatewayCommentObject])
  async replies(
    @Args('commentId', {
      type: () => ID,
    })
    commentId: string,

    @Context() context?: any,
  ) {
    return this.commentGatewayService.getReplies(
      commentId,
      this.getAuthorization(context),
    );
  }

  @Mutation(() => GatewayCommentObject)
  async updateComment(
    @Args('input', {
      type: () => GatewayUpdateCommentInput,
    })
    input: GatewayUpdateCommentInput,

    @Context() context?: any,
  ) {
    return this.commentGatewayService.updateComment(
      input,
      this.getAuthorization(context),
    );
  }

  @Mutation(() => Boolean)
  async deleteComment(
    @Args('commentId', {
      type: () => ID,
    })
    commentId: string,

    @Context() context?: any,
  ) {
    return this.commentGatewayService.deleteComment(
      commentId,
      this.getAuthorization(context),
    );
  }
}