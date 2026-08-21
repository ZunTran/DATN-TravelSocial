import { BadRequestException, Injectable, NotFoundException} from '@nestjs/common';

import { PostStatus } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { ShareRepository } from './share.repository';
import { UserProfileClient } from '../../../common/clients/user-profile/user-profile.client';
import { PaginationInput } from '../../../common/dto/pagination.input';
import { ShareList } from './objects/share-list.object';

@Injectable()
export class ShareService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly repository: ShareRepository,
    private readonly userProfileClient: UserProfileClient,
  ) {}

  async share( postId: string, accountId: string) {
    const profile = await this.userProfileClient.getByAccountId(accountId);
    const profileId = profile.profileId;

    return this.prisma.$transaction(async (tx) => {
      const post = await tx.post.findUnique({
        where: { id: postId },
        select: {
          id: true,
          status: true,
        },
      });

      if (!post) 
        throw new NotFoundException('Post not found');

      if (post.status !== PostStatus.PUBLISHED) 
        throw new BadRequestException( 'Only published posts can be shared' );

      const share = await this.repository.create(
        tx,
        postId,
        profileId,
      );

      await tx.post.update({
        where: { id: postId },
        data: {
          share_count: { increment: 1 },
        },
      });

      return {
        id: share.id,
        postId: share.post_id,
        userId: share.user_id,
        createdAt: share.created_at,
      };
    });
  }

  async getShares(postId: string,
  pagination: PaginationInput): Promise<ShareList> {
  const page = Math.max(1, pagination.page);
  const limit = Math.min(Math.max(1, pagination.limit), 100);
  const skip = (page - 1) * limit;

  const post = await this.prisma.post.findUnique({
    where: { id: postId },
    select: {
      id: true,
      status: true,
    },
  });

  if (!post) 
    throw new NotFoundException('Post not found');

  const [items, total] = await Promise.all([
    this.repository.findByPost(
      postId,
      skip,
      limit,
    ),
    this.repository.countByPost(postId),
  ]);

  return {
    items: items.map((share) => ({
      id: share.id,
      postId: share.post_id,
      userId: share.user_id,
      createdAt: share.created_at,
    })),
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}
}