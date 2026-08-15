import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class BlockRepository {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async find(blockerId: string,blockedId: string,
    tx?: Prisma.TransactionClient) {
    return (tx ?? this.prisma).block.findUnique({
      where: {blocker_id_blocked_id: {
          blocker_id: blockerId,
          blocked_id: blockedId,
        }}
    });
  }

  async create( blockerId: string,blockedId: string,reason?: string,
    tx?: Prisma.TransactionClient) {
    return (tx ?? this.prisma).block.create({
      data: {
        blocker_id: blockerId,
        blocked_id: blockedId,
        reason: reason || null,
      }
    });
  }

  async delete(blockerId: string,blockedId: string,
    tx?: Prisma.TransactionClient) {
    return (tx ?? this.prisma).block.delete({
      where: {blocker_id_blocked_id: {
          blocker_id: blockerId,
          blocked_id: blockedId,
        }},
    });
  }

  async findBlocked(blockerId: string,page: number,limit: number) {
    const skip = (page - 1) * limit;

    const where: Prisma.blockWhereInput = {blocker_id: blockerId};

    const [data, total] = await Promise.all([
      this.prisma.block.findMany({where,
        select: {
          blocked: {
            select: {
              id: true,
              account_id: true,
              username: true,
              display_name: true,
              avatar_url: true,
              cover_url: true,
              bio: true,
              gender: true,
              birthday: true,
              location: true,
              privacy: true,
              created_at: true,
              updated_at: true,
            }}
          },
        orderBy: {created_at: 'desc'},
        skip,
        take: limit,
      }),

      this.prisma.block.count({where}),
    ]);

    return {
      data: data.map(item => item.blocked),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  async isBlocked(blockerId: string,blockedId: string,
    tx?: Prisma.TransactionClient) {
    const block = await this.find(
      blockerId,
      blockedId,
      tx,
    );

    return !!block;
  }

  async isEitherBlocked(userA: string,userB: string,
    tx?: Prisma.TransactionClient) {
    return !!(await (tx ?? this.prisma).block.findFirst({
      where: {
        OR: [
          {
            blocker_id: userA,
            blocked_id: userB,
          },
          {
            blocker_id: userB,
            blocked_id: userA,
          },
        ]},
    }));
  }
  
}