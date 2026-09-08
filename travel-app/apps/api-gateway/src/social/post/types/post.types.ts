import {
  Field,
  ID,
  Int,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';

import {
  CategoryObject,
  LocationObject,
} from '../../metadata/types/metadata.types';


export enum PostPrivacy {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
}

export enum PostStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  DELETED = 'DELETED',
}

export enum MediaType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
}

registerEnumType(PostPrivacy, {
  name: 'PostPrivacy',
});

registerEnumType(PostStatus, {
  name: 'PostStatus',
});

registerEnumType(MediaType, {
  name: 'MediaType',
});



@ObjectType()
export class PostMediaObject {
  @Field(() => ID)
  id!: string;

  @Field(() => String)
  mediaUrl!: string;

  @Field(() => MediaType)
  mediaType!: MediaType;

  @Field(() => Int)
  displayOrder!: number;
}


@ObjectType()
export class PostObject {
  @Field(() => ID)
  id!: string;

  @Field(() => ID)
  authorId!: string;

  @Field(() => ID, {
    nullable: true,
  })
  categoryId?: string | null;

  @Field(() => ID, {
    nullable: true,
  })
  locationId?: string | null;

  @Field(() => String)
  content!: string;

  @Field(() => PostPrivacy)
  privacy!: PostPrivacy;

  @Field(() => PostStatus)
  status!: PostStatus;

  @Field(() => Date)
  createdAt!: Date;

  @Field(() => Date)
  updatedAt!: Date;

  @Field(() => Int)
  viewCount!: number;

  @Field(() => Int)
  likeCount!: number;

  @Field(() => Int)
  commentCount!: number;

  @Field(() => Int)
  shareCount!: number;

  @Field(() => Int)
  saveCount!: number;

  @Field(() => [PostMediaObject])
  media!: PostMediaObject[];

  @Field(() => CategoryObject, {
    nullable: true,
  })
  category?: CategoryObject | null;

  @Field(() => LocationObject, {
    nullable: true,
  })
  location?: LocationObject | null;

  @Field(() => String)
  authorUsername!: string;

  @Field(() => String, {
    nullable: true,
  })
  authorAvatar!: string | null;

  @Field(() => Boolean)
  isPostLiked!: boolean;

  @Field(() => Boolean)
  isPostSaved!: boolean;

}


@ObjectType()
export class PostListObject {
  @Field(() => [PostObject])
  items!: PostObject[];

  @Field(() => Int)
  total!: number;

  @Field(() => Int)
  page!: number;

  @Field(() => Int)
  limit!: number;

  @Field(() => Int)
  totalPages!: number;
}

export interface SocialPostResponse {
  id: string;
  authorId: string;
  categoryId?: string | null;
  locationId?: string | null;
  content: string;
  privacy: PostPrivacy;
  status: PostStatus;
  createdAt: string;
  updatedAt: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  shareCount: number;
  saveCount: number;
  isPostLiked: boolean;
  isPostSaved: boolean;
  authorUsername: string;
  authorAvatar: string | null;
  media: SocialPostMediaResponse[];
  category: SocialCategoryResponse | null;
  location: SocialLocationResponse | null;
  
}

export interface SocialPostMediaResponse {
  id: string;
  mediaUrl: string;
  mediaType: MediaType;
  displayOrder: number;
}

export interface SocialCategoryResponse {
  id: string;
  name: string;
  description?: string | null;
}

export interface SocialLocationResponse {
  id: string;
  name: string;
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  province?: string | null;
}