import { Injectable } from '@nestjs/common';
import { SocialGraphqlClient } from '../clients/social-graphql.client';
import { CommentList, CommentObject } from './types/interaction.types';
import { CreateCommentInput, UpdateCommentInput } from './dto/interaction.inputs';
import { PaginationInput } from '../post/dto/post.inputs';

interface CreateCommentResponse { createComment: CommentObject; }
interface UpdateCommentResponse { updateComment: CommentObject; }
interface DeleteCommentResponse { deleteComment: boolean; }
interface CommentsResponse { comments: CommentList; }
interface RepliesResponse { replies: CommentObject[]; }

@Injectable()
export class CommentGatewayService {
  constructor(private readonly socialClient: SocialGraphqlClient) {}

  async createComment(input: CreateCommentInput, authorization?: string): Promise<CommentObject> {
    const data = await this.socialClient.execute<CreateCommentResponse>(
      `
      mutation CreateComment($input: CreateCommentInput!) {
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

  async updateComment(input: UpdateCommentInput, authorization?: string): Promise<CommentObject> {
    const data = await this.socialClient.execute<UpdateCommentResponse>(
      `
      mutation UpdateComment($input: UpdateCommentInput!) {
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

  async deleteComment(commentId: string, authorization?: string): Promise<boolean> {
    const data = await this.socialClient.execute<DeleteCommentResponse>(
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

  async comments(postId: string, pagination: PaginationInput, authorization?: string): Promise<CommentList> {
    const data = await this.socialClient.execute<CommentsResponse>(
      `
      query Comments($postId: ID!, $pagination: PaginationInput!) {
        comments(postId: $postId, pagination: $pagination) {
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
      { postId, pagination },
      authorization,
    );

    return data.comments;
  }

  async replies(commentId: string, authorization?: string): Promise<CommentObject[]> {
    const data = await this.socialClient.execute<RepliesResponse>(
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
}