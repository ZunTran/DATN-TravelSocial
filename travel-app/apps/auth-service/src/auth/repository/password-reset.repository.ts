import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PasswordResetRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findRecentTokenByAccount(accountId: string) {
    return this.prisma.passwordResetToken.findFirst({
      where: { accountId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async invalidateOldTokens(accountId: string) {
    return this.prisma.passwordResetToken.updateMany({
      where: { accountId, used: false },
      data: { used: true },
    });
  }

  async createResetToken(accountId: string, tokenHash: string, expiredAt: Date) {
    return this.prisma.passwordResetToken.create({
      data: { accountId, tokenHash, expiredAt },
    });
  }

  async findValidToken(tokenHash: string) {
    return this.prisma.passwordResetToken.findFirst({
      where: { tokenHash, used: false, expiredAt: { gte: new Date() } },
      include: { account: true },
    });
  }

  async markTokenAsUsed(tokenId: string) {
    return this.prisma.passwordResetToken.update({
      where: { id: tokenId },
      data: { used: true },
    });
  }
}