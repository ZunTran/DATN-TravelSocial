import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class LoginSessionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createLoginSession(data: { accountId: string; refreshTokenId?: string; deviceName?: string; ipAddress?: string }) {
    return this.prisma.loginSession.create({
      data: {
        accountId: data.accountId,
        refreshTokenId: data.refreshTokenId,
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

  async logoutAllDevices(accountId: string) {
    return this.prisma.loginSession.updateMany({
      where: { accountId, isActive: true },
      data: { isActive: false },
    });
  }
}