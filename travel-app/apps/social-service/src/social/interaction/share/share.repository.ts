import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class ShareRepository {
   constructor(
    private readonly prisma: PrismaService,
  ) {}
  async create(
    tx: Prisma.TransactionClient,
    postId: string,
    userId: string) {
    return tx.share.create({
      data: {
        post_id: postId,
        user_id: userId,
      },
    });
  }

  async findByPost(
  postId: string,
  skip: number,
  take: number,
  tx?: Prisma.TransactionClient) {
    const db = tx ?? this.prisma;

    return db.share.findMany({
      where: { post_id: postId },
      orderBy: { created_at: 'desc' },
      skip,
      take,
    });
  }

async countByPost(
  postId: string,
  tx?: Prisma.TransactionClient) {
    const db = tx ?? this.prisma;

    return db.share.count({
      where: { post_id: postId},
    });
  }

}
