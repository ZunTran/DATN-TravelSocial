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

  async updateLastLogin(accountId: string) {
    return this.prisma.account.update({
      where: { id: accountId },
      data: { lastLoginAt: new Date() },
    });
  }
  //==========----------------||---------------===========//

  async markEmailVerified(accountId: string) {
    return this.prisma.account.update({
      where: { id: accountId },
      data: { emailVerified: true },
    });
  }

  //==========|--- SESSION MANAGEMENT---|===========//
  async createLoginSession(data: { accountId: string; deviceName?: string; ipAddress?: string }) {
    return this.prisma.loginSession.create({
      data: {
        accountId: data.accountId,
        deviceName: data.deviceName || 'Unknown Device',
        ipAddress: data.ipAddress || '127.0.0.1',
        isActive: true,
      },
    });
  }

  async getActiveSessions(accountId: string) {
    return this.prisma.loginSession.findMany({
      where: { accountId, isActive: true },
      orderBy: { lastActiveAt: 'desc' },
    });
  }

  async terminateSession(sessionId: string, accountId: string) {
    return this.prisma.loginSession.updateMany({
      where: { id: sessionId, accountId },
      data: { isActive: false },
    });
  }


  // --- OAuth ---

  

}