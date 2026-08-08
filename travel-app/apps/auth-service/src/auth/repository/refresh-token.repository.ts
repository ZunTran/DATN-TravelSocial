import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class RefreshTokenRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createRefreshToken(accountId: string, tokenHash: string, expiredAt: Date) {
    return this.prisma.refreshToken.create({
      data: { accountId, tokenHash, expiredAt },
    });
  }

  async findRefreshToken(tokenHash: string) {
    return this.prisma.refreshToken.findFirst({
      where: { tokenHash, revoked: false, expiredAt: { gte: new Date() } },
      include: { 
        account: true,
       },
    });
  }

  async revokeRefreshToken(tokenHash: string) {
    return this.prisma.refreshToken.updateMany({
      where: { tokenHash },
      data: { revoked: true },
    });
  }

  async revokeAllRefreshTokens(accountId: string) {
    return this.prisma.refreshToken.updateMany({
      where: { accountId, revoked: false },
      data: { revoked: true },
    });
  }
}