import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { HashtagFilterInput } from './dto/hashtag-filter.input';

@Injectable()
export class HashtagRepository {
  constructor(
    private readonly prisma: PrismaService,
  ) {}
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

  async update( tx: Prisma.TransactionClient, id: string, name: string) {
    return tx.hashtag.update({
      where: { id },
      data: { name },
    });
  }

  async delete( tx: Prisma.TransactionClient, id: string) {
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

  async adminFindMany(
    tx: Prisma.TransactionClient | PrismaService,
    options: { search?: string; skip: number; take: number}) {
    return tx.hashtag.findMany({
      where: options.search
        ? { name: { contains: options.search, mode: 'insensitive'} }: undefined,

      orderBy: { name: 'asc'},
      skip: options.skip,
      take: options.take,
      include: {_count: { select: { posts: true }},
      },
    });
  }

  async adminCount( tx: Prisma.TransactionClient | PrismaService, search?: string) {
    return tx.hashtag.count({
      where: search
        ? { name: { contains: search, mode: 'insensitive'} } : undefined,
    });
  }

  async countPosts(tx: Prisma.TransactionClient | PrismaService, hashtagId: string) {
    return tx.post_hashtag.count({
      where: { hashtag_id: hashtagId},
    });
  }


  async findPage(filter: HashtagFilterInput) {
  const page = filter.page ?? 1;
  const limit = filter.limit ?? 20;
  const skip = (page - 1) * limit;
  const trimmedSearch = filter.search?.trim();

  const where: Prisma.hashtagWhereInput = trimmedSearch
    ? {
        name: {
          contains: trimmedSearch,
          mode: 'insensitive',
        },
      }
    : {};

  const [items, total] = await Promise.all([
    this.prisma.hashtag.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        name: 'asc',
      },
    }),

    this.prisma.hashtag.count({
      where,
    }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    items,
    total,
    page,
    limit,
    totalPages,
    hasNextPage: page < totalPages,
  };
}

}