import { Injectable } from '@nestjs/common';
import { account_role, account_status, user_privacy } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AdminRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAccountByEmail(email: string) {
    return this.prisma.account.findUnique({
      where: { email },
    });
  }

  async createAdminWithProfile(email: string, passwordHash: string) {
    return this.prisma.$transaction(async (tx) => {
      const newAccount = await tx.account.create({
        data: {
          email,
          password_hash: passwordHash,
          role: account_role.ADMIN,
          status: account_status.ACTIVE,
          email_verified: true,
          tokenVersion: 0,
        },
      });

      const newProfile = await tx.user_profile.create({
        data: {
          account_id: newAccount.id,
          username: `admin_${Date.now()}`,
          display_name: 'System Administrator',
          privacy: user_privacy.PUBLIC,
        },
      });

      return { newAccount, newProfile };
    });
  }
}