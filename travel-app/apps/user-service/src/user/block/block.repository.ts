import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class BlockRepository {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async find(blockerId: string,blockedId: string,) {
    return this.prisma.block.findUnique({
      where: {blocker_id_blocked_id: {blocker_id: blockerId,blocked_id: blockedId}},
    });
  }

  async isBlocked(blockerId: string,blockedId: string,) {
    const block = await this.find(blockerId,blockedId);
    return !!block;
  }

  async isEitherBlocked(userA: string,userB: string) {
    return this.prisma.block.findFirst({
      where: {
        OR: [
          {
            blocker_id: userA,
            blocked_id: userB,
          },
          {
            blocker_id: userB,
            blocked_id: userA,
          }],
      }});
  }

}