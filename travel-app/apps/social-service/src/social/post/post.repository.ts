import { Injectable } from '@nestjs/common';
import {Prisma, PostPrivacy, PostStatus, MediaType} from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';


@Injectable()
export class PostRepository {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  private mapPost(
  post: Prisma.postGetPayload<{
    include: {
      media: true;
      category: true;
      location: true;
    };
  }>,
) {
  return {
    id: post.id,
    authorId: post.author_id,
    categoryId: post.category_id,
    locationId: post.location_id,
    content: post.content,
    privacy: post.privacy,
    status: post.status,
    viewCount: Number(post.view_count),
    likeCount: post.like_count,
    commentCount: post.comment_count,
    shareCount: post.share_count,
    saveCount: post.save_count,
    authorUsername: post.author_username,
    authorAvatar: post.author_avatar,
    createdAt: post.created_at,
    updatedAt: post.updated_at,
    media: this.mapMedia(post.media),
    category: post.category,
    location: post.location,
  };
}

  async create(tx: Prisma.TransactionClient,
    data: {
      authorId: string;
      authorUsername: string;
      authorAvatar: string | null;
      content: string;
      status: PostStatus;
      privacy: PostPrivacy;
      categoryId?: string | null;
      locationId?: string | null;
    }) {
    return tx.post.create({
      data: {
        author_id: data.authorId,
        author_username: data.authorUsername,
        author_avatar: data.authorAvatar,
        content: data.content,
        status: data.status,
        privacy: data.privacy,
        category_id: data.categoryId ?? null,
        location_id: data.locationId ?? null,
      },
    });
  }

  private mapMedia(media: Array<{
    id: string;
    media_url: string;
    media_type: MediaType;
    display_order: number;
  }>) {
  return media.map((m) => ({
    id: m.id,
    mediaUrl: m.media_url,
    mediaType: m.media_type,
    displayOrder: m.display_order,
  }));
}

  async findById(id: string,tx?: Prisma.TransactionClient) {
  const db = tx ?? this.prisma;

  const post = await db.post.findUnique({
    where: { id },
    include: {
      media: {
        orderBy: {display_order: 'asc'},
      },
      category: true,
      location: true,
    },
  });
  if (!post) return null;

  return this.mapPost(post);
 }

  async findByIdForTransaction(tx: Prisma.TransactionClient, id: string) {
  return tx.post.findUnique({where: { id }});
 }


  async update(tx: Prisma.TransactionClient,
    id: string,  data: Prisma.postUpdateInput) {
    return tx.post.update({
      where: { id },
      data
    });
  }

  async delete(tx: Prisma.TransactionClient,id: string) {
    return tx.post.update({
      where: {id},
      data: {
        status: PostStatus.DELETED,
        updated_at: new Date(),
      }
    });
  }


  async hardDelete(tx: Prisma.TransactionClient,id: string,) {
    return tx.post.delete({
      where: {id}
    });
  }

  async countDrafts(tx: Prisma.TransactionClient,authorId: string,) {
    return tx.post.count({
      where: {
        author_id: authorId,
        status: PostStatus.DRAFT,
      }
    });
  }

  async findMany(where: Prisma.postWhereInput,skip: number,take: number) {
  const posts = await this.prisma.post.findMany({
    where,
    skip,
    take,
    orderBy: { created_at: 'desc',},
    include: {
      media: { orderBy: { display_order: 'asc'}},
      category: true,
      location: true,
    },
  });

  return posts.map((post) => this.mapPost(post));
}

  async count(where: Prisma.postWhereInput) {
    return this.prisma.post.count({where});
  }

  async addView(id: string) {
  return this.prisma.post.update({
    where: {id},
    data: {view_count: {increment: 1}},
  });
}

  private encodeCursor(createdAt: Date, id: string): string {
    return Buffer.from(
      JSON.stringify({
        createdAt: createdAt.toISOString(),
        id,
      }),
    ).toString('base64');
  }

  private decodeCursor(cursor?: string): { createdAt: Date; id: string } | null {
    if (!cursor) return null;

    try {
      const decoded = JSON.parse( Buffer.from(cursor, 'base64').toString('utf8'));

      return {
        createdAt: new Date(decoded.createdAt),
        id: decoded.id,
      };
    } catch {
      return null;
    }
  }

  async findFeed( authorIds: string[], cursor?: string, take = 10) {
    if (authorIds.length === 0) {
      return {
        items: [],
        hasNextPage: false,
        endCursor: null,
      };
    }

    const decodedCursor = cursor ? this.decodeCursor(cursor) : null;
    const where: Prisma.postWhereInput = {
      author_id: { in: authorIds},
      status: PostStatus.PUBLISHED,
      privacy: PostPrivacy.PUBLIC,

      ...(decodedCursor && {
        OR: [
          {created_at: { lt: decodedCursor.createdAt}},
          {
            created_at: decodedCursor.createdAt,
            id: { lt: decodedCursor.id},
          },
        ],
      }),
    };

    const posts = await this.prisma.post.findMany({
      where,
      orderBy: [
        { created_at: 'desc' },
        { id: 'desc' },
      ],

      take: take + 1,

      include: {
        media: { orderBy: { display_order: 'asc'},},
        category: true,
        location: true,
      },
    });

    const hasNextPage = posts.length > take;
    const slicedPosts = hasNextPage? posts.slice(0, take): posts;
    const items = slicedPosts.map((post) =>this.mapPost(post));
    const lastPost = slicedPosts[slicedPosts.length - 1];

    const endCursor = lastPost ? this.encodeCursor( lastPost.created_at, lastPost.id ) : null;

    return {
      items,
      hasNextPage,
      endCursor,
    };
  }

  async findManyByIds( ids: string[]) {
    if (ids.length === 0) {
      return [];
    }

    const posts = await this.prisma.post.findMany({
      where: {
        id: {
          in: ids,
        },
        status: PostStatus.PUBLISHED,
      },
      include: {
        media: {
          orderBy: { display_order: 'asc' },
        },
        category: true,
        location: true,
      },
    });

    const postMap = new Map(
      posts.map((post) => [post.id, post]),
    );

    return ids
      .map((id) => postMap.get(id))
      .filter(
        ( post ): post is (typeof posts)[number] => post !== undefined,
      )
      .map((post) => this.mapPost(post));
  }

}