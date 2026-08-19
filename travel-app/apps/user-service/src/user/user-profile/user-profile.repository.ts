import { Injectable } from '@nestjs/common';

import { Prisma } from '@prisma/client';
import { SearchUserInput } from './dto/search-user.input';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UserProfileRepository {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async create(data: Prisma.user_profileCreateInput) {
    return this.prisma.user_profile.create({data});
  }

  async findById(id: string) {
    return this.prisma.user_profile.findUnique({where: { id }});
  }

  async findByAccountId(account_id: string) {
    return this.prisma.user_profile.findFirst({where: { account_id }});
  }


  async findByUsername(username: string) {
    return this.prisma.user_profile.findUnique({where: { username }});
  }

  async update(id: string,data: Prisma.user_profileUpdateInput) {
    return this.prisma.user_profile.update({where: { id },data});
  }

  async searchUsers(input: SearchUserInput) {
  const { keyword, page, limit } = input;
  const skip = (page - 1) * limit;

  const whereCondition = keyword
    ? {
        OR: [
          { username: { contains: keyword, mode: 'insensitive' as const } },
          { display_name: { contains: keyword, mode: 'insensitive' as const } },
        ],
      }
    : {};

  const [data, total] = await Promise.all([
    this.prisma.user_profile.findMany({
      where: whereCondition,
      skip,
      take: limit,
      orderBy: { created_at: 'desc' },
    }),
    
    this.prisma.user_profile.count({ where: whereCondition })
  ]);

  return {
    data,total,
    page,limit,
    totalPages: Math.ceil(total / limit),
  };
}

  async findInternalByAccountId(accountId: string) {
  return this.prisma.user_profile.findUnique({
    where: {
      account_id: accountId,
    },
    select: {
      id: true,
      account_id: true,
      username: true,
      avatar_url: true,
    },
  });
}

}