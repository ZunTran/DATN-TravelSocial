import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Injectable()
export class SavePostRepository {
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
}
