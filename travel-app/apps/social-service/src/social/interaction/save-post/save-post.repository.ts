import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class SavePostRepository {
    constructor(
      private readonly prisma: PrismaService,
    ) {}

  async find(
    tx: Prisma.TransactionClient,
    postId: string,
    userId: string,
  ) {
    return tx.save_post.findUnique({
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
    postId: string,
    userId: string,
  ) {
    return tx.save_post.create({
      data: {
        post_id: postId,
        user_id: userId,
      },
    });
  }

  async delete(
    tx: Prisma.TransactionClient,
    postId: string,
    userId: string,
  ) {
    return tx.save_post.delete({
      where: {
        post_id_user_id: {
          post_id: postId,
          user_id: userId,
        },
      },
    });
  }


  async findByProfileAndPostIds(
    profileId: string,
    postIds: string[],
  ) {
    if (postIds.length === 0) {
      return [];
    }

    return this.prisma.save_post.findMany({
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
