import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ProviderType } from '@prisma/client';

@Injectable()
export class OauthRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findOauthAccount(provider: ProviderType, providerUserId: string) {
    return this.prisma.oauthAccount.findUnique({
      where: { provider_providerUserId: { provider, providerUserId } },
      include: { account: true },
    });
  }

  async createOauthAccount(accountId: string, provider: ProviderType, providerUserId: string) {
    return this.prisma.oauthAccount.create({
      data: { accountId, provider, providerUserId },
    });
  }
}