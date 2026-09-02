import {
  Field,
  ID,
  Int,
  ObjectType,
} from '@nestjs/graphql';

import {
  PostPrivacy,
  PostStatus,
} from '@prisma/client';

import '../enums/post.enum';

import { PostMediaObject } from './post-media.object';
import { CategoryObject } from '../../metadata/category/objects/category.object';
import { LocationObject } from '../../metadata/location/objects/location.object';

@ObjectType()
export class PostObject {
  @Field(() => ID)
  id!: string;

  @Field(() => ID)
  authorId!: string;

  @Field(() => ID, { nullable: true })
  categoryId?: string | null;

  @Field(() => ID, { nullable: true })
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

   @Field(() => Boolean)
  isPostLiked!: boolean;

  @Field(() => Boolean)
  isPostSaved!: boolean;
  

  @Field(() => [PostMediaObject])
  media!: PostMediaObject[];

  @Field(() => CategoryObject, { nullable: true })
  category?: CategoryObject | null;

  @Field(() => LocationObject, { nullable: true })
  location?: LocationObject | null;

  @Field(() => String)
  authorUsername!: string;

  @Field(() => String, { nullable: true })
  authorAvatar!: string | null;
}