import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class CommentRepository {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async findById(
    tx: Prisma.TransactionClient,
    id: string,
  ) {
    return tx.comment.findUnique({
      where: { id },
    });
  }

  async create(
    tx: Prisma.TransactionClient,
    data: {
      postId: string;
      authorId: string;
      parentCommentId: string | null;
      content: string;
    },
  ) {
    return tx.comment.create({
      data: {
        post_id: data.postId,
        author_id: data.authorId,
        parent_comment_id: data.parentCommentId,
        content: data.content,
      },
    });
  }

  async update(
    tx: Prisma.TransactionClient,
    id: string,
    content: string,
  ) {
    return tx.comment.update({
      where: { id },
      data: {
        content,
      },
    });
  }

  async delete(
    tx: Prisma.TransactionClient,
    id: string,
  ) {
    return tx.comment.delete({
      where: { id },
    });
  }

  async findByPost(postId: string,
    skip: number,
    take: number) {
    return this.prisma.comment.findMany({
      where: {
        post_id: postId,
        parent_comment_id: null,
      },
      orderBy: {created_at: 'asc'},
      skip,
      take,
    });
  }

  async findReplies(
    parentCommentId: string,
  ) {
    return this.prisma.comment.findMany({
      where: {
        parent_comment_id: parentCommentId,
      },
      orderBy: {
        created_at: 'asc',
      },
    });
  }

  async countByPost(postId: string) {
  return this.prisma.comment.count({
    where: {
      post_id: postId,
      parent_comment_id: null,
    },
  });
}

}
