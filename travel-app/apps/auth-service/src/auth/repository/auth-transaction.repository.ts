import { Injectable, UnauthorizedException } from '@nestjs/common';
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

      console.log(
  '[Auth DB] LOGIN TOKEN CREATED - refreshTokenHash:',
  token.id,
  token.tokenHash.slice(0, 10),
);

      await tx.loginSession.create({
        data: {
          accountId,
          refreshTokenId: token.id,
          deviceName: deviceName || 'Unknown Device',
          ipAddress: ipAddress || '127.0.0.1',
          isActive: true,
          lastActiveAt: new Date(),
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

  async logoutTransaction(tokenHash: string) {
    return this.prisma.$transaction(async (tx) => {
      const token = await tx.refreshToken.findFirst({
        where: { tokenHash },
      });

      if (!token) return ;

      await tx.refreshToken.update({
        where: { id: token.id },
        data: { revoked: true },
      });

     await tx.loginSession.updateMany({
        where: { refreshTokenId: token.id }, 
        data: { 
          isActive: false,
          lastActiveAt: new Date(), },
      });

      return true;
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
      const oldToken = await tx.refreshToken.findFirst({
        where: { tokenHash, revoked: false, expiredAt: { gte: new Date() } },
        include: { account: true,
        loginSession: true,
        },
      });
      
  console.log( '[Auth DB] FIND TOKEN:', tokenHash.slice(0, 10));
  console.log('[Auth DB] TOKEN EXISTS:', !!oldToken);

  if (!oldToken) {
    throw new UnauthorizedException('REFRESH TOKEN NOT FOUND' );
  }

  console.log('[Auth DB] Token revoked:', oldToken.revoked);
  console.log('[Auth DB] Token expiredAt:',oldToken.expiredAt);
  console.log('[Auth DB] Token expired:',oldToken.expiredAt < new Date());

  if (oldToken.revoked) {
    throw new UnauthorizedException( 'REFRESH TOKEN ALREADY REVOKED');
  }

  if (oldToken.expiredAt < new Date()) {
    throw new UnauthorizedException( 'REFRESH TOKEN EXPIRED');
  }

      await tx.refreshToken.update({
        where: { id: oldToken.id },
        data: { revoked: true },
      });

      const newToken =await tx.refreshToken.create({
        data: { accountId: oldToken.accountId, tokenHash: newRefreshTokenHash, expiredAt },
      });

      console.log('[Auth DB] NEW TOKEN CREATED:', newToken.id,newToken.tokenHash);

      if (oldToken.loginSession) {
      await tx.loginSession.update({
        where: {id: oldToken.loginSession.id,},
        data: {
          refreshTokenId: newToken.id,
          lastActiveAt: new Date(),
        },
      });
    }

      return oldToken.account;
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