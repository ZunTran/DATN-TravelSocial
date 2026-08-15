import {ConflictException,Injectable,NotFoundException} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { BlockRepository } from './block.repository';
import { FollowRepository } from '../follow/follow.repository';
import { UserProfileRepository } from '../user-profile/user-profile.repository';
import { Prisma } from '@prisma/client';

@Injectable()
export class BlockService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly blockRepository: BlockRepository,
    private readonly followRepository: FollowRepository,
    private readonly userProfileRepository: UserProfileRepository,
  ) {}

async block(accountId: string,targetProfileId: string,reason?: string) {
  const profile =await this.userProfileRepository.findByAccountId(accountId);
  if (!profile) throw new NotFoundException('User profile not found');
  if (profile.id === targetProfileId) throw new ConflictException('Cannot block yourself');
  
  const target =await this.userProfileRepository.findById(targetProfileId);
  if (!target) throw new NotFoundException('User not found');
  const normalizedReason = reason?.trim();

  const existed =await this.blockRepository.find(profile.id,targetProfileId);
  if (existed) throw new ConflictException('User already blocked');

  try {
    return await this.prisma.$transaction(async tx => {
        const block =await this.blockRepository.create(profile.id,targetProfileId,normalizedReason,tx);
        await this.followRepository.deleteIfExists(profile.id,targetProfileId,tx);
        await this.followRepository.deleteIfExists(targetProfileId,profile.id,tx);
        return block;
      });
  } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError &&error.code === 'P2002') {
        throw new ConflictException('User already blocked');
      }
      throw error;
    }
  }

  async unblock(accountId: string,targetProfileId: string) {
  const profile =await this.userProfileRepository.findByAccountId(accountId);
  if (!profile) throw new NotFoundException('User profile not found');
  
  const existed =await this.blockRepository.find(profile.id,targetProfileId);
  if (!existed) throw new NotFoundException('You have not blocked this user');
  
  try {
    await this.blockRepository.delete(profile.id,targetProfileId);

    return true;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError &&error.code === 'P2025') {
    throw new NotFoundException('You have not blocked this user');
    }

    throw error;
  }
}

  async isBlocked(accountId: string,targetProfileId: string) {
    const profile =await this.userProfileRepository.findByAccountId(accountId);
    if (!profile) throw new NotFoundException('User profile not found');
    return this.blockRepository.isBlocked(profile.id,targetProfileId);
  }

  async blockedUsers(accountId: string,page: number,limit: number) {
    const profile =await this.userProfileRepository.findByAccountId(accountId);
    if (!profile) throw new NotFoundException('User profile not found');
    return this.blockRepository.findBlocked(
      profile.id,
      page,
      limit
    );
  }
}