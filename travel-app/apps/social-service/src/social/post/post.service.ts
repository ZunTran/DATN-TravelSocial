import { BadRequestException, ForbiddenException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { MediaType, PostPrivacy, PostStatus, Prisma } from '@prisma/client';
import { PostRepository } from './post.repository';
import { CreatePostInput } from './dto/create-post.input';
import { UpdatePostInput } from './dto/update-post.input';
import { PostFilterInput } from './dto/post-filter.input';
import { PrismaService } from '../../prisma/prisma.service';
import { UserProfileClient } from '../../common/clients/user-profile/user-profile.client';
import { CategoryRepository } from '../metadata/category/category.repository';
import { LocationRepository } from '../metadata/location/location.repository';
import { HashtagRepository } from '../metadata/hashtag/hashtag.repository';
import { CloudinaryService } from '../../common/cloudinary/cloudinary.service';
import type { FileUpload } from 'graphql-upload-ts';
import { FollowClient } from '../../common/clients/follow/follow.client';
import { LikeService } from '../interaction/like/like.service';
import { SavePostService } from '../interaction/save-post/save-post.service';

@Injectable()
export class PostService {
  private readonly MAX_DRAFTS = 20;
  private readonly MAX_MEDIA = 10;
  private readonly MAX_HASHTAGS = 10;

  constructor(
    private readonly prisma: PrismaService,
    private readonly postRepository: PostRepository,
    private readonly userProfileClient: UserProfileClient,
    private readonly categoryRepository: CategoryRepository,
    private readonly locationRepository: LocationRepository,
    private readonly hashtagRepository: HashtagRepository,
    private readonly cloudinaryService: CloudinaryService,
    private readonly followClient: FollowClient,

    @Inject(forwardRef(() => LikeService))
    private readonly likeService: LikeService,

    @Inject(forwardRef(() => SavePostService))
    private readonly savePostService: SavePostService,

  ) {}

async createPostWithFiles(accountId: string,input: CreatePostInput,
  files?: Promise<FileUpload>[]) {
  const uploads = files ? await Promise.all(files) : [];

  if (uploads.length > this.MAX_MEDIA)
    throw new BadRequestException(`Maximum ${this.MAX_MEDIA} media files allowed`);

  const media: Array<{
    mediaUrl: string;
    mediaType: MediaType;
    displayOrder: number;
  }> = [];

  for (const [index, file] of uploads.entries()) {
    if (file.mimetype?.startsWith('image/')) {
      const result = await this.cloudinaryService.uploadImage(file);

      media.push({
        mediaUrl: result.secure_url,
        mediaType: MediaType.IMAGE,
        displayOrder: index,
      });
    } else if (file.mimetype?.startsWith('video/')) {
      const result = await this.cloudinaryService.uploadVideo(file);

      media.push({
        mediaUrl: result.secure_url,
        mediaType: MediaType.VIDEO,
        displayOrder: index,
      });
    } else {
      throw new BadRequestException(`Unsupported media type: ${file.mimetype ?? 'unknown'}`,);
    }
  }

  return this.createPost(accountId, input, media);
}

  async createPost(accountId: string, input: CreatePostInput, media: Array<{ mediaUrl: string; mediaType: MediaType; displayOrder?: number }> = []) {
    const author = await this.userProfileClient.getByAccountId(accountId);
    const content = input.content ?? '';
    const privacy = input.privacy ?? PostPrivacy.PUBLIC;
    const status = input.status ?? PostStatus.PUBLISHED;

    this.validateMedia(media);
    this.validateHashtags(input.hashtagIds);

    if (status === PostStatus.DELETED) 
      throw new BadRequestException('Cannot create a deleted post');
    this.validatePublishedPost(status, content, media.length > 0);

    return this.prisma.$transaction(async (tx) => {
      if (status === PostStatus.DRAFT) {
        const draftCount = await this.postRepository.countDrafts(tx, author.profileId);
        if (draftCount >= this.MAX_DRAFTS) throw new BadRequestException(`Maximum ${this.MAX_DRAFTS} drafts allowed`);
      }

      if (input.categoryId) {
        const category = await this.categoryRepository.findById(tx, input.categoryId);
        if (!category) throw new NotFoundException('Category not found');
      }

      if (input.locationId) {
        const location = await this.locationRepository.findById(tx, input.locationId);
        if (!location) throw new NotFoundException('Location not found');
      }

      const post = await this.postRepository.create(tx, {
        authorId: author.profileId,
        authorUsername: author.username,
        authorAvatar: author.avatarUrl ?? null,
        content,
        status,
        privacy,
        categoryId: input.categoryId,
        locationId: input.locationId,
      });

      if (media.length) {
        await tx.post_media.createMany({
          data: media.map((item, index) => ({
            post_id: post.id,
            media_url: item.mediaUrl,
            media_type: item.mediaType,
            display_order: item.displayOrder ?? index,
          })),
        });
      }

      if (input.hashtagIds !== undefined) await this.syncHashtags(tx, post.id, input.hashtagIds);

      return this.postRepository.findById(post.id, tx);
    }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
  }

  async updatePost(accountId: string, input: UpdatePostInput) {
    const author = await this.userProfileClient.getByAccountId(accountId);
    const profileId = author.profileId;
    this.validateMedia(input.media);

    this.validateHashtags(input.hashtagIds);

    return this.prisma.$transaction(async (tx) => {
      const post = await this.postRepository.findByIdForTransaction(tx, input.id);
      if (!post) throw new NotFoundException('Post not found');
      if (post.author_id !== profileId) throw new ForbiddenException('You are not the owner of this post');
      if (post.status !== PostStatus.DRAFT) throw new BadRequestException('Only draft posts can be updated');
      
      if (input.status === PostStatus.DELETED) throw new BadRequestException('Deleted post cannot be updated');

      if (input.status !== undefined) this.validateStatusTransition(post.status, input.status);

      if (input.status === PostStatus.DRAFT && post.status !== PostStatus.DRAFT) {
        const draftCount = await this.postRepository.countDrafts(tx, profileId);
        if (draftCount >= this.MAX_DRAFTS) throw new BadRequestException(`Maximum ${this.MAX_DRAFTS} drafts allowed`);
      }

      const finalStatus = input.status ?? post.status;
      const finalContent = input.content !== undefined ? input.content : post.content;
      const existingMediaCount = await tx.post_media.count({where: { post_id: input.id }});

      const hasMedia = input.media !== undefined? input.media.length > 0: existingMediaCount > 0;
      this.validatePublishedPost(finalStatus, finalContent, hasMedia);

       if (input.status === PostStatus.PUBLISHED) {

      } else if (input.status !== undefined && input.status !== PostStatus.DRAFT) {
        throw new BadRequestException('Invalid status transition');
      }

      if (input.categoryId) {
        const category = await this.categoryRepository.findById(tx, input.categoryId);
        if (!category) throw new NotFoundException('Category not found');
      }

      if (input.locationId) {
        const location = await this.locationRepository.findById(tx, input.locationId);
        if (!location) throw new NotFoundException('Location not found');
      }

      const updated = await this.postRepository.update(tx, input.id, {
        ...(input.content !== undefined && { content: input.content }),
        ...(input.status !== undefined && { status: input.status }),
        ...(input.privacy !== undefined && { privacy: input.privacy }),
        ...(input.categoryId !== undefined && { category_id: input.categoryId }),
        ...(input.locationId !== undefined && { location_id: input.locationId }),
        updated_at: new Date(),
      });

      if (input.media !== undefined) {
        await tx.post_media.deleteMany({ where: { post_id: input.id } });

        if (input.media.length) {
          await tx.post_media.createMany({
            data: input.media.map((media, index) => ({
              post_id: input.id,
              media_url: media.mediaUrl,
              media_type: media.mediaType,
              display_order: media.displayOrder ?? index,
            })),
          });
        }
      }

      if (input.hashtagIds !== undefined) await this.syncHashtags(tx, input.id, input.hashtagIds);

      return this.postRepository.findById(updated.id, tx);
    }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
  }

  async deletePost(accountId: string, postId: string) {
    const author = await this.userProfileClient.getByAccountId(accountId);
    const profileId = author.profileId;

    return this.prisma.$transaction(async (tx) => {
      const post = await this.postRepository.findByIdForTransaction(tx, postId);
      if (!post) throw new NotFoundException('Post not found');
      if (post.author_id !== profileId) throw new ForbiddenException('You are not the owner of this post');
      if (post.status === PostStatus.DELETED) throw new BadRequestException('Post already deleted');
      return this.postRepository.delete(tx, postId);
    }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
  }

  async getPost(postId: string, accountId: string) {
    const post = await this.postRepository.findById(postId);
    if (!post || post.status === PostStatus.DELETED) throw new NotFoundException('Post not found');
    if (post.privacy === PostPrivacy.PUBLIC) return post;

    const profile = await this.userProfileClient.getByAccountId(accountId);
    if (post.authorId !== profile.profileId) throw new ForbiddenException('You cannot view this post');

    return post;
  }


    async getPosts(
    accountId: string,
    filter: PostFilterInput,
    page: number,
    limit: number,
  ) {
    const where: Prisma.postWhereInput = {
      status: PostStatus.PUBLISHED,
      privacy: PostPrivacy.PUBLIC,

      ...(filter.authorId && {
        author_id: filter.authorId,
      }),

      ...(filter.categoryId && {
        category_id: filter.categoryId,
      }),

      ...(filter.locationId && {
        location_id: filter.locationId,
      }),
    };

    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.postRepository.findMany(
        where,
        skip,
        limit,
      ),
      this.postRepository.count(where),
    ]);

    const postsWithInteraction = await this.attachInteractionStatus( accountId, items);


    console.log('===== GET POSTS =====');
console.log('accountId:', accountId);
console.log(
  'items:',
  items.map((p) => ({
    id: p.id,
    author_id: p.authorId,
    authorId: p.authorId,
  })),
);
console.log(
  'postsWithInteraction:',
  postsWithInteraction.map((p) => ({
    id: p.id,
    isPostLiked: p.isPostLiked,
    isPostSaved: p.isPostSaved,
  })),
);


    return {
      items: postsWithInteraction,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

 async incrementView(postId: string) {
 const post = await this.postRepository.findById(postId);

  if (!post) 
    throw new NotFoundException('Post not found');
  
  if (post.status !== PostStatus.PUBLISHED) {
    throw new BadRequestException('Only published posts can be viewed');
  }

  await this.postRepository.addView(postId);
  return this.postRepository.findById(postId);
}

  private validateMedia(media?: Array<{ mediaUrl: string; mediaType: MediaType; displayOrder?: number }>) {
    if (media && media.length > this.MAX_MEDIA) throw new BadRequestException(`Maximum ${this.MAX_MEDIA} media files allowed`);
  }

  private validateHashtags(hashtagIds?: string[]) {
    if (hashtagIds && hashtagIds.length > this.MAX_HASHTAGS) throw new BadRequestException(`Maximum ${this.MAX_HASHTAGS} hashtags allowed`);
  }

  private async syncHashtags(tx: Prisma.TransactionClient, postId: string, hashtagIds: string[]) {
    const normalized = [...new Set(hashtagIds.filter(Boolean))];
    if (normalized.length > this.MAX_HASHTAGS) throw new BadRequestException(`Maximum ${this.MAX_HASHTAGS} hashtags allowed`);

    const hashtags = await this.hashtagRepository.findByIds(tx, normalized);
    if (hashtags.length !== normalized.length) throw new NotFoundException('One or more hashtags not found');

    await this.hashtagRepository.deletePostHashtags(tx, postId);
    await this.hashtagRepository.createPostHashtags(tx, postId, normalized);
  }

  private validatePublishedPost(status: PostStatus, content?: string | null, hasMedia = false) {
    if (status === PostStatus.PUBLISHED && !content?.trim() && !hasMedia) {
      throw new BadRequestException('Published post must have content or media');
    }
  }

  private validateStatusTransition(current: PostStatus, target: PostStatus) {
    if (current === PostStatus.DELETED) throw new BadRequestException('Deleted post cannot be modified');
    if (target === PostStatus.DELETED) return;
    if (current === PostStatus.DRAFT && (target === PostStatus.DRAFT || target === PostStatus.PUBLISHED)) return;
    if (current === PostStatus.PUBLISHED && target === PostStatus.PUBLISHED) return;
    throw new BadRequestException(`Invalid post status transition: ${current} -> ${target}`);
  }

  async updatePostWithFiles(accountId: string,input: UpdatePostInput,
    files?: Promise<FileUpload>[]) {
      const author = await this.userProfileClient.getByAccountId(accountId);

      const post = await this.postRepository.findById(input.id);
      if (!post) 
        throw new NotFoundException('Post not found');
  
      if (post.authorId !== author.profileId) 
        throw new ForbiddenException('You are not the owner of this post');

      if (post.status !== PostStatus.DRAFT) 
        throw new BadRequestException('Only draft posts can be updated');

      const uploads = files ? await Promise.all(files) : [];

      if (uploads.length > this.MAX_MEDIA) 
        throw new BadRequestException(`Maximum ${this.MAX_MEDIA} media files allowed`);

      const media: Array<{
        mediaUrl: string;
        mediaType: MediaType;
        displayOrder: number;
      }> = [];

      for (const [index, file] of uploads.entries()) {
        if (file.mimetype?.startsWith('image/')) {
          const result = await this.cloudinaryService.uploadImage(file);

          media.push({
            mediaUrl: result.secure_url,
            mediaType: MediaType.IMAGE,
            displayOrder: index,
          });
        } else if (file.mimetype?.startsWith('video/')) {
          const result = await this.cloudinaryService.uploadVideo(file);

          media.push({
            mediaUrl: result.secure_url,
            mediaType: MediaType.VIDEO,
            displayOrder: index,
          });
        } else {
          throw new BadRequestException(`Unsupported media type: ${file.mimetype ?? 'unknown'}`);
        }
  }

  return this.updatePost(accountId, {
    ...input,
    ...(files !== undefined && {media}),
  });
}

async changePostStatus(accountId: string, postId: string, newStatus: PostStatus) {
  const author = await this.userProfileClient.getByAccountId(accountId);
  const profileId = author.profileId;

  return this.prisma.$transaction(async (tx) => {
    const post = await this.postRepository.findByIdForTransaction(tx, postId);
    if (!post) throw new NotFoundException('Post not found');

    if (post.author_id !== profileId) {
      throw new ForbiddenException('You are not the owner of this post');
    }

    if (post.status === PostStatus.DELETED || newStatus === PostStatus.DELETED) {
      if (post.status === PostStatus.DELETED) throw new BadRequestException('Deleted post cannot be modified');
    }

    if (post.status === newStatus) return post;

    this.validateStatusTransition(post.status, newStatus);

    if (newStatus === PostStatus.DRAFT && post.status !== PostStatus.DRAFT) {
      const draftCount = await this.postRepository.countDrafts(tx, profileId);
      if (draftCount >= this.MAX_DRAFTS) {
        throw new BadRequestException(`Maximum ${this.MAX_DRAFTS} drafts allowed`);
      }
    }

    if (newStatus === PostStatus.PUBLISHED) {
      const existingMediaCount = await tx.post_media.count({ where: { post_id: postId } });
      this.validatePublishedPost(newStatus, post.content, existingMediaCount > 0);
    }

    await this.postRepository.update(tx, postId, {
      status: newStatus,
      updated_at: new Date(),
    });

    return this.postRepository.findById(postId, tx);
  }, {
    isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
  });
}

  async changePostPrivacy(accountId: string, postId: string, newPrivacy: PostPrivacy) {
    const author = await this.userProfileClient.getByAccountId(accountId);
    const profileId = author.profileId;

    return this.prisma.$transaction(async (tx) => {
      const post = await this.postRepository.findByIdForTransaction(tx, postId);
      if (!post) throw new NotFoundException('Post not found');

      if (post.author_id !== profileId) 
        throw new ForbiddenException('You are not the owner of this post');
      if (post.status === PostStatus.DELETED) 
        throw new BadRequestException('Deleted post cannot be modified');
    
      if (post.privacy === newPrivacy) return post;
      await this.postRepository.update(tx, postId, {
        privacy: newPrivacy,
        updated_at: new Date(),
      });

      return this.postRepository.findById(postId, tx);
    }, {
      isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
    });
  }

  async getFeed( accountId: string, cursor?: string, limit = 10) {
  if (limit < 1 || limit > 50) 
    throw new BadRequestException(' Feed limit must be between 1 and 50');
  
  const followingProfileIds = await this.followClient.getFollowingProfileIds( accountId);
  const feed = await this.postRepository.findFeed( followingProfileIds, cursor, limit, ); 
  const items = await this.attachInteractionStatus( accountId, feed.items, );
  return { ...feed, items, };
  }


  private async attachInteractionStatus(
    accountId: string,
    posts: any[],
  ) {
    if (posts.length === 0) {
      return posts;
    }

    const postIds = posts.map((post) => post.id);

    const [likedPostIds, savedPostIds] = await Promise.all([
      this.likeService.getLikedPostIds(
        accountId,
        postIds,
      ),
      this.savePostService.getSavedPostIds(
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

}