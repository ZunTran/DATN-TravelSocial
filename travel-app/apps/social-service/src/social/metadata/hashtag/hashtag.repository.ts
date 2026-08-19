import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Injectable()
export class HashtagRepository {
  async findByIds(
    tx: Prisma.TransactionClient,
    ids: string[]) {
    return tx.hashtag.findMany({
      where: {
        id: {in: ids},
      },
      select: {id: true},
    });
  }

  async deletePostHashtags(
    tx: Prisma.TransactionClient,
    postId: string) {
    return tx.post_hashtag.deleteMany({
      where: {post_id: postId},
    });
  }

  async createPostHashtags(
    tx: Prisma.TransactionClient,
    postId: string,
    hashtagIds: string[],) {
    return tx.post_hashtag.createMany({
      data: hashtagIds.map((hashtagId) => ({
        post_id: postId,
        hashtag_id: hashtagId,
      })),
    });
  }
}