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

   async findAll(
    tx: Prisma.TransactionClient,
  ) {
    return tx.hashtag.findMany({
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findById(
    tx: Prisma.TransactionClient,
    id: string,
  ) {
    return tx.hashtag.findUnique({
      where: { id },
    });
  }

  async findByName(
    tx: Prisma.TransactionClient,
    name: string,
  ) {
    return tx.hashtag.findUnique({
      where: { name },
    });
  }

  async create(
    tx: Prisma.TransactionClient,
    name: string,
  ) {
    return tx.hashtag.create({
      data: {
        name,
      },
    });
  }

  async update(
    tx: Prisma.TransactionClient,
    id: string,
    name: string,
  ) {
    return tx.hashtag.update({
      where: { id },
      data: {
        name,
      },
    });
  }

  async delete(
    tx: Prisma.TransactionClient,
    id: string,
  ) {
    return tx.hashtag.delete({
      where: { id },
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
      skipDuplicates: true,
    });
  }
}