import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProfileInput } from './dto/create-profile.input';
import { UpdateProfileInput } from './dto/update-profile.input';

@Injectable()
export class UserProfileRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(accountId: string, data: CreateProfileInput) {
    return this.prisma.user_profile.create({
      data: {
        account_id: accountId,
        username: data.username,
        display_name: data.display_name,
        avatar_url: data.avatar_url,
      },
    });
  }

  async findByAccountId(accountId: string) {
    return this.prisma.user_profile.findUnique({
      where: { account_id: accountId },
    });
  }

  async findByUsername(username: string) {
    return this.prisma.user_profile.findUnique({
      where: { username },
    });
  }

  async updateByAccountId(accountId: string, data: UpdateProfileInput) {
    return this.prisma.user_profile.update({
      where: { account_id: accountId },
      data,
    });
  }

  async searchUsers(keyword: string) {
    return this.prisma.user_profile.findMany({
      where: {
        OR: [
          { username: { contains: keyword, mode: 'insensitive' } },
          { display_name: { contains: keyword, mode: 'insensitive' } },
        ],
      },
      take: 20,
    });
  }
}