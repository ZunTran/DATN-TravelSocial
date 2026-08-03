import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AccountRole, AccountStatus } from '@prisma/client';

@Injectable()
export class AccountRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string) {
    return this.prisma.account.findUnique({
      where: { email },
    });
  }

  async findById(id: string) {
    return this.prisma.account.findUnique({
      where: { id },
    });
  }

  async createAccount(data: { email: string; passwordHash: string }) {
    return this.prisma.account.create({
      data: {
        email: data.email,
        passwordHash: data.passwordHash,
        role: AccountRole.USER,
        status: AccountStatus.ACTIVE,
      },
    });
  }

  //==========|--- FORGOT & RESET PASSWORD ---|===========//

  async findRecentTokenByAccount(accountId: string) {
    return this.prisma.passwordResetToken.findFirst({
      where: { accountId },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Vô hiệu hóa all token cũ chưa sử dụng của tài khoản
  async invalidateOldTokens(accountId: string) {
    return this.prisma.passwordResetToken.updateMany({
      where: { accountId, used: false },
      data: { used: true },
    });
  }

  async createResetToken(accountId: string, tokenHash: string, expiredAt: Date) {
    return this.prisma.passwordResetToken.create({
      data: {
        accountId,
        tokenHash,
        expiredAt,
      },});
  }

  async findValidToken(tokenHash: string) {
    return this.prisma.passwordResetToken.findFirst({
      where: {
        tokenHash,
        used: false,
        expiredAt: { gte: new Date() },
      },
      include: { account: true }, // Lấy kèm thông tin account để đổi pass
    });
  }

  async markTokenAsUsed(tokenId: string) {
    return this.prisma.passwordResetToken.update({
      where: { id: tokenId },
      data: { used: true },});
  }

  async updatePassword(accountId: string, passwordHash: string) {
    return this.prisma.account.update({
      where: { id: accountId },
      data: { passwordHash },});
  }
  //==========----------------||---------------===========//

  //==========|--- REFRESH TOKEN ---|===========//
  async createRefreshToken(accountId: string, tokenHash: string, expiredAt: Date) {
    return this.prisma.refreshToken.create({
      data: {
        accountId,
        tokenHash,
        expiredAt,
      },});
  }

  async findRefreshToken(tokenHash: string) {
    return this.prisma.refreshToken.findFirst({
      where: {
        tokenHash,
        revoked: false,
        expiredAt: { gte: new Date() },
      },
      include: { account: true },
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
  //==========----------------||---------------===========//

}