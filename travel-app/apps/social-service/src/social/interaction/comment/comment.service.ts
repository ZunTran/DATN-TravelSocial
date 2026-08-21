import { BadRequestException, ForbiddenException, Injectable, NotFoundException} from '@nestjs/common';

import { PostStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { CommentRepository } from './comment.repository';
import { CreateCommentInput } from './dto/create-comment.input';
import { UpdateCommentInput } from './dto/update-comment.input';
import { UserProfileClient } from '../../../common/clients/user-profile/user-profile.client';
import { PaginationInput } from '../../../common/dto/pagination.input';
import { CommentList } from './objects/comment-list.object';

@Injectable()
export class CommentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly repository: CommentRepository,
    private readonly userProfileClient: UserProfileClient,
  ) {}

  private mapComment(comment: Prisma.commentGetPayload<{}>) {
  return {
    id: comment.id,
    postId: comment.post_id,
    authorId: comment.author_id,
    parentCommentId: comment.parent_comment_id,
    content: comment.content,
    createdAt: comment.created_at,
  };
}

  async create(accountId: string, input: CreateCommentInput,) {
    const profile = await this.userProfileClient.getByAccountId(accountId);
    const profileId = profile.profileId;

    return this.prisma.$transaction(async (tx) => {
      const post = await tx.post.findUnique({
        where: { id: input.postId},
        select: {
          id: true,
          status: true,
        },
      });

      if (!post) 
        throw new NotFoundException('Post not found');
      
      if (post.status !== PostStatus.PUBLISHED) 
        throw new BadRequestException('Only published posts can be commented');
      
      let parentCommentId: string | null = null;
      if (input.parentCommentId) {
        const parent = await this.repository.findById(
          tx,
          input.parentCommentId,
        );

        if (!parent) 
          throw new NotFoundException( 'Parent comment not found',);
        
        if (parent.post_id !== input.postId) 
          throw new BadRequestException( 'Parent comment does not belong to this post' );
        
        parentCommentId = parent.id;
      }

      const comment = await this.repository.create(
        tx,
        {
          postId: input.postId,
          authorId: profileId,
          parentCommentId,
          content: input.content.trim(),
        },
      );

      if (!parentCommentId){
        await tx.post.update({
        where: {id: input.postId},
        data: { comment_count: { increment: 1}},
      });
    }

      return this.mapComment(comment);
    });
  }

  async update( accountId: string, input: UpdateCommentInput,) {
    const profile = await this.userProfileClient.getByAccountId(accountId);
    const profileId = profile.profileId;

    return this.prisma.$transaction(async (tx) => {
      const comment = await this.repository.findById(
        tx,
        input.id,
      );

      if (!comment) 
        throw new NotFoundException('Comment not found');
      
      if (comment.author_id !== profileId) 
        throw new ForbiddenException( 'You are not the owner of this comment',);
      
      const updated = await this.repository.update(
        tx,
        input.id,
        input.content.trim(),
      );

      return this.mapComment(updated);
    });
  }

  async delete( accountId: string, commentId: string) {
    const profile = await this.userProfileClient.getByAccountId(accountId);
    const profileId = profile.profileId;

    return this.prisma.$transaction(async (tx) => {
      const comment = await this.repository.findById(
        tx,
        commentId,
      );

      if (!comment) 
        throw new NotFoundException('Comment not found');
      
      if (comment.author_id !== profileId) 
        throw new ForbiddenException( 'You are not the owner of this comment');
      
      await this.repository.delete(tx, commentId);

      if (comment.parent_comment_id === null) {
        await tx.post.update({
          where: {id: comment.post_id,},
          data: { comment_count: { decrement: 1 }}
        });
      }

      return true;
    });
  }


  async getComments( postId: string, pagination: PaginationInput): Promise<CommentList> {
    const page = Math.max(1, pagination.page);
    const limit = Math.min(Math.max(1, pagination.limit), 100);
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.repository.findByPost(postId, skip, limit),
      this.repository.countByPost(postId),
    ]);

      return {
      items: items.map((comment) => this.mapComment(comment)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
    
  }

  async getReplies(commentId: string) {
    const replies = await this.repository.findReplies(commentId);
    return replies.map((reply) => this.mapComment(reply));

  }
}