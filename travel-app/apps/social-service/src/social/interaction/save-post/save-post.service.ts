import { BadRequestException,  Injectable, NotFoundException } from '@nestjs/common';
import { PostStatus } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { SavePostRepository } from './save-post.repository';
import { UserProfileClient } from '../../../common/clients/user-profile/user-profile.client';
import { LikeService } from '../like/like.service';

@Injectable()
export class SavePostService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly repository: SavePostRepository,
    private readonly userProfileClient: UserProfileClient,
  private readonly likeService: LikeService,
  ) {}

  private async attachInteractionStatus(
  accountId: string,
  posts: any[],
) {
  if (posts.length === 0) {
    return posts;
  }

  const postIds = posts.map(
    (post) => post.id,
  );

  const [likedPostIds, savedPostIds] =
    await Promise.all([
      this.likeService.getLikedPostIds(
        accountId,
        postIds,
      ),
      this.getSavedPostIds(
        accountId,
        postIds,
      ),
    ]);

  return posts.map((post) => ({
    ...post,
    isPostLiked: likedPostIds.has(post.id),
    isPostSaved: savedPostIds.has(post.id),
  }));
}

  async save( postId: string, accountId: string, ) {
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
        throw new BadRequestException('Only published posts can be saved');
      
      const existing = await this.repository.find(
        tx,
        postId,
        profileId,
      );

      if (existing) 
        throw new BadRequestException('Post already saved');

      const saved = await this.repository.create(
        tx,
        postId,
        profileId,
      );

      await tx.post.update({
        where: { id: postId },
        data: { save_count: { increment: 1},},
      });

      return {
        postId: saved.post_id,
        userId: saved.user_id,
        savedAt: saved.saved_at,
      };
    });
  }

  async unsave(postId: string, accountId: string) {
    const profile = await this.userProfileClient.getByAccountId(accountId);
    const profileId = profile.profileId;

    return this.prisma.$transaction(async (tx) => {
      const existing = await this.repository.find(
        tx,
        postId,
        profileId,
      );

      if (!existing) 
        throw new BadRequestException('Post has not been saved');
      
      const saved = await this.repository.delete(
        tx,
        postId,
        profileId,
      );

      await tx.post.update({
        where: { id: postId },
        data: {  save_count: { decrement: 1 } },
      });

      return {
        postId: saved.post_id,
        userId: saved.user_id,
        savedAt: saved.saved_at,
      };
    });
  }

  async isSaved( postId: string, accountId: string): Promise<boolean> {
    const profile = await this.userProfileClient.getByAccountId(accountId);
    const profileId = profile.profileId;

    const saved = await this.prisma.save_post.findUnique({
      where: {
        post_id_user_id: {
          post_id: postId,
          user_id: profileId,
        },
      },
    });

    return !!saved;
  }



  async getSavedPostIds(
    accountId: string,
    postIds: string[],
  ): Promise<Set<string>> {
    if (postIds.length === 0) {
      return new Set<string>();
    }

    const profile =
      await this.userProfileClient.getByAccountId(accountId);

    const saves =
      await this.repository.findByProfileAndPostIds(
        profile.profileId,
        postIds,
      );

    return new Set(
      saves.map((save) => save.post_id),
    );
  }

async getSavedPosts(
  accountId: string,
  page = 1,
  limit = 10,
) {
  const profile =
    await this.userProfileClient.getByAccountId(accountId);

  const profileId = profile.profileId;

  const skip = (page - 1) * limit;

  const [posts, total] = await Promise.all([
    this.repository.findSavedPosts(
      profileId,
      skip,
      limit,
    ),
    this.repository.countSavedPosts(
      profileId,
    ),
  ]);

  const postsWithInteraction =
    await this.attachInteractionStatus(
      accountId,
      posts,
    );

  return {
    items: postsWithInteraction,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}
}