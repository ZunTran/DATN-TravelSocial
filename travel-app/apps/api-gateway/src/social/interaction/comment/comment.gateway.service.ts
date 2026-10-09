import { Injectable } from '@nestjs/common';

import { SocialGraphqlClient } from '../../clients/social-graphql.client';
import {
  CREATE_COMMENT,
  DELETE_COMMENT,
  GET_COMMENTS,
  GET_REPLIES,
  UPDATE_COMMENT,
} from './comment.queries';
import {
  GatewayCreateCommentInput,
  GatewayUpdateCommentInput,
} from './dto/comment.input';
import { PaginationInput } from '../../post/dto/post.inputs';

interface GatewayCommentListResponse {
  comments: {
    items: Array<{
      id: string;
      postId: string;
      authorId: string;
      author: {
        id: string;
        username: string;
        avatarUrl: string | null;
      };
      parentCommentId: string | null;
      content: string;
      createdAt: string;
    }>;
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
  };
}

@Injectable()
export class CommentGatewayService {
  constructor(
    private readonly socialClient: SocialGraphqlClient,
  ) {}

  private mapComment(comment: {
  id: string;
  postId: string;
  authorId: string;
  author: {
    id: string;
    username: string;
    avatarUrl: string | null;
  };
  parentCommentId: string | null;
  content: string;
  createdAt: string | Date;
}) {
  return {
    ...comment,
    createdAt: new Date(comment.createdAt),
  };
}

  async getComments(
    postId: string,
    pagination: PaginationInput,
    authorization: string,
  ) {
    const result =
      await this.socialClient.execute<GatewayCommentListResponse>(
        GET_COMMENTS,
        {
          postId,
          pagination,
        },
        authorization,
      );

    const comments = result.comments;

    return {
      items: comments.items.map((comment) =>
    this.mapComment(comment),
  ),
      total: comments?.total ?? 0,
      page: comments?.page ?? pagination.page ?? 1,
      limit: comments?.limit ?? pagination.limit ?? 10,
      totalPages: comments?.totalPages ?? 0,
      hasNextPage: comments?.hasNextPage ?? false,
    };
  }

async createComment(
  input: GatewayCreateCommentInput,
  authorization: string,
) {
  const result = await this.socialClient.execute<{
    createComment: {
      id: string;
      postId: string;
      authorId: string;
      author: {
        id: string;
        username: string;
        avatarUrl: string | null;
      };
      parentCommentId: string | null;
      content: string;
      createdAt: string;
    };
  }>(
    CREATE_COMMENT,
    { input },
    authorization,
  );

  return this.mapComment(result.createComment);
}
 

async updateComment(
  input: GatewayUpdateCommentInput,
  authorization: string,
) {
  const result = await this.socialClient.execute<{
    updateComment: {
      id: string;
      postId: string;
      authorId: string;
      author: {
        id: string;
        username: string;
        avatarUrl: string | null;
      };
      parentCommentId: string | null;
      content: string;
      createdAt: string;
    };
  }>(
    UPDATE_COMMENT,
    { input },
    authorization,
  );

  return this.mapComment(result.updateComment);
}


  async deleteComment(
    commentId: string,
    authorization: string,
  ) {
    const result = await this.socialClient.execute<{
      deleteComment: boolean;
    }>(
      DELETE_COMMENT,
      {
        commentId,
      },
      authorization,
    );

    return result.deleteComment;
  }

  async getReplies(
    commentId: string,
    authorization: string,
  ) {
    const result = await this.socialClient.execute<{
      replies: unknown[];
    }>(
      GET_REPLIES,
      {
        commentId,
      },
      authorization,
    );

    return result.replies ?? [];
  }
}