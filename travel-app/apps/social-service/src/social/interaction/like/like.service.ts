import { BadRequestException, Injectable, NotFoundException,} from '@nestjs/common';
import { PostStatus } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { LikeRepository } from './like.repository';
import { UserProfileClient } from '../../../common/clients/user-profile/user-profile.client';
import { PaginationInput } from '../../../common/dto/pagination.input';
import { LikeList } from './objects/like-list.object';

@Injectable()
export class LikeService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly likeRepository: LikeRepository,
    private readonly userProfileClient: UserProfileClient,
  ) {}

  async like(postId: string,accountId: string) {
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
        throw new BadRequestException('Only published posts can be liked',);
      
      const existing = await this.likeRepository.find(
        tx,
        postId,
        profileId,
      );

      if (existing) 
        throw new BadRequestException('You already liked this post');
      
      const like = await this.likeRepository.create(
        tx,
        postId,
        profileId,
      );

      await tx.post.update({
        where: { id: postId },
        data: {
          like_count: {increment: 1},
        },
      });

      return {
        postId: like.post_id,
        userId: like.user_id,
        createdAt: like.created_at,
      };
    });
  }

  async unlike(postId: string,accountId: string) {
    const profile = await this.userProfileClient.getByAccountId(accountId);
    const profileId = profile.profileId;

    return this.prisma.$transaction(async (tx) => {
      const existing = await this.likeRepository.find(
        tx,
        postId,
        profileId,
      );

      if (!existing) 
        throw new BadRequestException('You have not liked this post');

      const like = await this.likeRepository.delete(
        tx,
        postId,
        profileId,
      );

      await tx.post.update({
        where: { id: postId },
        data: {like_count: { decrement: 1},},
      });

      return {
        postId: like.post_id,
        userId: like.user_id,
        createdAt: like.created_at,
      };
    });
  }

  async isLiked(postId: string,accountId: string,): Promise<boolean> {
    const profile = await this.userProfileClient.getByAccountId(accountId);
    const profileId = profile.profileId;

    const like = await this.prisma.post_like.findUnique({
      where: {
        post_id_user_id: {
          post_id: postId,
          user_id: profileId,
        },
      },
    });

    return !!like;
  }

  async getLikes(postId: string,pagination: PaginationInput): Promise<LikeList> {
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
      this.likeRepository.findByPost(
        postId,
        skip,
        limit,
      ),
      this.likeRepository.countByPost(postId),
    ]);

    return {
      items: items.map((like) => ({
        postId: like.post_id,
        userId: like.user_id,
        createdAt: like.created_at,
      })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getLikedPostIds( accountId: string, postIds: string[]): Promise<Set<string>> {
    if (postIds.length === 0) {
      return new Set<string>();
    }

    const profile = await this.userProfileClient.getByAccountId(accountId);

    const likes = await this.likeRepository.findByProfileAndPostIds( profile.profileId, postIds);

    return new Set( likes.map((like) => like.post_id));
  }


}