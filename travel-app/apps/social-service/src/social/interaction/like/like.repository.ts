import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class LikeRepository {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async find(
    tx: Prisma.TransactionClient,
    postId: string, userId: string) {
    return tx.post_like.findUnique({
      where: {
        post_id_user_id: {
          post_id: postId,
          user_id: userId,
        },
      },
    });
  }

  async create(
    tx: Prisma.TransactionClient,
    postId: string, userId: string) {
    return tx.post_like.create({
      data: {
        post_id: postId,
        user_id: userId,
      }
    });
  }

  async delete(
    tx: Prisma.TransactionClient,
    postId: string, userId: string) {
    return tx.post_like.delete({
      where: {
        post_id_user_id: {
          post_id: postId,
          user_id: userId,
        }
      },
    });
  }

  async count(tx: Prisma.TransactionClient, postId: string) {
    return tx.post_like.count({
      where: { post_id: postId },
    });
  }

  async findByPost(postId: string,
    skip: number,
    take: number) {
    return this.prisma.post_like.findMany({
      where: { post_id: postId},
      orderBy: { created_at: 'desc'},
      skip,
      take,
    });
  }

  async countByPost(postId: string) {
    return this.prisma.post_like.count({
      where: { post_id: postId},
    });
  }


async findByProfileAndPostIds(
  profileId: string,
  postIds: string[],
) {
  if (postIds.length === 0) {
    return [];
  }

  return this.prisma.post_like.findMany({
    where: {
      user_id: profileId,
      post_id: {
        in: postIds,
      },
    },
    select: {
      post_id: true,
    },
  });
}


}
