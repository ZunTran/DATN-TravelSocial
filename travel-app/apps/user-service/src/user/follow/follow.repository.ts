import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class FollowRepository {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  private client(tx?: Prisma.TransactionClient) {
    return tx ?? this.prisma;
  }

  async find(followerId: string, followingId: string) {
    return this.prisma.follow.findUnique({
      where: {follower_id_following_id: {
          follower_id: followerId,
          following_id: followingId,
        }},
    });
  }

  async create(followerId: string,followingId: string,
    tx?: Prisma.TransactionClient) {
    return this.client(tx).follow.create({
      data: {
        follower_id: followerId,
        following_id: followingId,
      }});
  }

  async delete(followerId: string,followingId: string,
    tx?: Prisma.TransactionClient) {
    return this.client(tx).follow.delete({
      where: {follower_id_following_id: {
          follower_id: followerId,
          following_id: followingId,
        }},
    });
  }

  async countFollowers(userId: string) {
    return this.prisma.follow.count({where: {following_id: userId}});
  }

  async countFollowing(userId: string) {
    return this.prisma.follow.count({where: {follower_id: userId}});
  }

  async findFollowers(userId: string,page: number,limit: number,) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.follow.findMany({
        where: {following_id: userId},
        include: {follower: true},
        orderBy: {created_at: 'desc'},
        skip,
        take: limit,
      }),
      this.prisma.follow.count({where: {following_id: userId}}),
    ]);

    return { data: data.map((item) => item.follower),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findFollowing(userId: string,page: number,limit: number) {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.follow.findMany({
        where: {follower_id: userId},
        include: {following: true},
        orderBy: {created_at: 'desc'},
        skip,
        take: limit,
      }),
      this.prisma.follow.count({ where: {follower_id: userId}}),
    ]);

    return {
      data: data.map((item) => item.following),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async deleteIfExists(followerId: string,followingId: string,
  tx?: Prisma.TransactionClient) {
  return (tx ?? this.prisma).follow.deleteMany({where: {
      follower_id: followerId,
      following_id: followingId
    }});
}

  async findFollowingIds(profileId: string) {
    return this.prisma.follow.findMany({
      where: {
        follower_id: profileId,
      },
      select: {
        following_id: true,
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  }
}