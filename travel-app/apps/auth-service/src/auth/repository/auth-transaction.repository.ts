import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AccountRole, AccountStatus, ProviderType } from '@prisma/client';

@Injectable()
export class AuthTransactionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async loginTransaction(accountId: string, refreshTokenHash: string, expiredAt: Date, deviceName?: string, ipAddress?: string) {
    return this.prisma.$transaction(async (tx) => {
      await tx.account.update({
        where: { id: accountId },
        data: { lastLoginAt: new Date() },
      });

      const token = await tx.refreshToken.create({
        data: { accountId, tokenHash: refreshTokenHash, expiredAt },
      });

      await tx.loginSession.create({
        data: {
          accountId,
          refreshTokenId: token.id,
          deviceName: deviceName || 'Unknown Device',
          ipAddress: ipAddress || '127.0.0.1',
          isActive: true,
        },
      });

      return token;
    });
  }

  async resetPasswordTransaction(accountId: string, passwordHash: string, resetTokenId: string) {
    return this.prisma.$transaction(async (tx) => {
      await tx.passwordResetToken.update({
        where: { id: resetTokenId },
        data: { used: true },
      });

      await tx.account.update({
        where: { id: accountId },
        data: { passwordHash, tokenVersion: { increment: 1 } },
      });

      await tx.refreshToken.updateMany({
        where: { accountId, revoked: false },
        data: { revoked: true },
      });

      await tx.loginSession.updateMany({
        where: { accountId, isActive: true },
        data: { isActive: false },
      });
    });
  }

  async logoutAllTransaction(accountId: string) {
    return this.prisma.$transaction(async (tx) => {
      await tx.refreshToken.updateMany({
        where: { accountId, revoked: false },
        data: { revoked: true },
      });

      await tx.loginSession.updateMany({
        where: { accountId, isActive: true },
        data: { isActive: false },
      });

      await tx.account.update({
        where: { id: accountId },
        data: { tokenVersion: { increment: 1 } },
      });
    });
  }

  async changePasswordTransaction(accountId: string, passwordHash: string) {
    return this.prisma.$transaction(async (tx) => {
      await tx.account.update({
        where: { id: accountId },
        data: { passwordHash, tokenVersion: { increment: 1 } },
      });

      await tx.refreshToken.updateMany({
        where: { accountId, revoked: false },
        data: { revoked: true },
      });

      await tx.loginSession.updateMany({
        where: { accountId, isActive: true },
        data: { isActive: false },
      });
    });
  }

  async rotateRefreshTokenTransaction(tokenHash: string, newRefreshTokenHash: string, expiredAt: Date) {
    return this.prisma.$transaction(async (tx) => {
      const token = await tx.refreshToken.findFirst({
        where: { tokenHash, revoked: false, expiredAt: { gte: new Date() } },
        include: { account: true },
      });
      if (!token) throw new Error("Invalid token");

      await tx.refreshToken.update({
        where: { id: token.id },
        data: { revoked: true },
      });

      await tx.refreshToken.create({
        data: { accountId: token.accountId, tokenHash: newRefreshTokenHash, expiredAt },
      });

      return token.account;
    });
  }

  async oauthLoginTransaction(email: string, provider: ProviderType, providerUserId: string, refreshTokenHash: string, expiredAt: Date, deviceName?: string, ipAddress?: string) {
    return this.prisma.$transaction(async (tx) => {
      let oauthRecord = await tx.oauthAccount.findUnique({
        where: { provider_providerUserId: { provider, providerUserId } },
        include: { account: true },
      });

      let account = oauthRecord ? oauthRecord.account : null;

      if (!account) {
        account = await tx.account.findUnique({ where: { email } });
        if (account) {
          await tx.oauthAccount.create({ data: { accountId: account.id, provider, providerUserId } });
        } else {
          account = await tx.account.create({
            data: {
              email,
              passwordHash: '',
              emailVerified: true,
              role: AccountRole.USER,     
              status: AccountStatus.ACTIVE,
              oauthAccounts: { create: { provider, providerUserId } },
            },
          });
        }
      }

      const token = await tx.refreshToken.create({
        data: { accountId: account.id, tokenHash: refreshTokenHash, expiredAt },
      });

      await tx.loginSession.create({
        data: {
          accountId: account.id,
          refreshTokenId: token.id,
          deviceName: deviceName || 'OAuth Device',
          ipAddress: ipAddress || '127.0.0.1',
          isActive: true,
        },
      });

      return account;
    });
  }
}