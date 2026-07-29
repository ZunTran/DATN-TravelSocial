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
}