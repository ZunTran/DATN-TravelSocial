import { Injectable } from '@nestjs/common';
import { PostStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { PostRepository } from '../../post/post.repository';

@Injectable()
export class SavePostRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly postRepository: PostRepository,
  ) {}

  async find(
    tx: Prisma.TransactionClient,
    postId: string,
    userId: string,
  ) {
    return tx.save_post.findUnique({
      where: {
        post_id_user_id: {
          post_id: postId,
          user_id: userId,
        },
      },
    });
  }

  async create(
    tx: Prisma.TransactionClient,
    postId: string,
    userId: string,
  ) {
    return tx.save_post.create({
      data: {
        post_id: postId,
        user_id: userId,
      },
    });
  }

  async delete(
    tx: Prisma.TransactionClient,
    postId: string,
    userId: string,
  ) {
    return tx.save_post.delete({
      where: {
        post_id_user_id: {
          post_id: postId,
          user_id: userId,
        },
      },
    });
  }

  async findByProfileAndPostIds(
    profileId: string,
    postIds: string[],
  ) {
    if (postIds.length === 0) {
      return [];
    }

    return this.prisma.save_post.findMany({
      where: {
        user_id: profileId,
        post_id: {
          in: postIds,
        },
      },
      select: {
        post_id: true,
      },
    });
  }

async findSavedPosts(
  userId: string,
  skip: number,
  take: number,
) {
  const savedPosts = await this.prisma.save_post.findMany({
    where: {
      user_id: userId,
      post: {
        status: PostStatus.PUBLISHED,
      },
    },
    orderBy: {
      saved_at: 'desc',
    },
    skip,
    take,
    select: {
      post_id: true,
    },
  });

  const postIds = savedPosts.map(
    (item) => item.post_id,
  );

  return this.postRepository.findManyByIds(postIds);
}

  async countSavedPosts(userId: string) {
    return this.prisma.save_post.count({
      where: {
        user_id: userId,
        post: {
          status: PostStatus.PUBLISHED,
        },
      },
    });
  }
}