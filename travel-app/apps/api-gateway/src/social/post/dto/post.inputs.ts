import {
  Field,
  ID,
  InputType,
  Int,
} from '@nestjs/graphql';

import {
  IsArray,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

import {
  MediaType,
  PostPrivacy,
  PostStatus,
} from '../types/post.types';

@InputType()
export class CreatePostMediaInput {
  @Field(() => MediaType)
  @IsEnum(MediaType)
  mediaType!: MediaType;

  @Field(() => Int, {
    nullable: true,
    defaultValue: 0,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(99)
  displayOrder?: number;
}

@InputType()
export class CreatePostInput {
  @Field(() => String, {
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @MaxLength(10000)
  content?: string;

  @Field(() => ID, {
    nullable: true,
  })
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @Field(() => ID, {
    nullable: true,
  })
  @IsOptional()
  @IsUUID()
  locationId?: string;

  @Field(() => PostPrivacy, {
    nullable: true,
    defaultValue: PostPrivacy.PUBLIC,
  })
  @IsOptional()
  @IsEnum(PostPrivacy)
  privacy?: PostPrivacy;

  @Field(() => PostStatus, {
    nullable: true,
    defaultValue: PostStatus.PUBLISHED,
  })
  @IsOptional()
  @IsEnum(PostStatus)
  status?: PostStatus;

  @Field(() => [ID], {
    nullable: true,
  })
  @IsOptional()
  @IsArray()
  @IsUUID('all')
  hashtagIds?: string[];

  @Field(() => [CreatePostMediaInput], {
    nullable: true,
  })
  @IsOptional()
  @IsArray()
  media?: CreatePostMediaInput[];
}

@InputType()
export class UpdatePostMediaInput {
  @Field()
  @IsString()
  mediaUrl!: string;

  @Field(() => MediaType)
  @IsEnum(MediaType)
  mediaType!: MediaType;

  @Field(() => Int, {
    nullable: true,
    defaultValue: 0,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(99)
  displayOrder?: number;
}

@InputType()
export class UpdatePostInput {
  @Field(() => ID)
  @IsUUID()
  id!: string;

  @Field(() => String, {
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @MaxLength(10000)
  content?: string;

  @Field(() => PostStatus, {
    nullable: true,
  })
  @IsOptional()
  @IsEnum(PostStatus)
  status?: PostStatus;

  @Field(() => PostPrivacy, {
    nullable: true,
  })
  @IsOptional()
  @IsEnum(PostPrivacy)
  privacy?: PostPrivacy;

  @Field(() => ID, {
    nullable: true,
  })
  @IsOptional()
  @IsUUID()
  categoryId?: string | null;

  @Field(() => ID, {
    nullable: true,
  })
  @IsOptional()
  @IsUUID()
  locationId?: string | null;

  @Field(() => [UpdatePostMediaInput], {
    nullable: true,
  })
  @IsOptional()
  @IsArray()
  media?: UpdatePostMediaInput[];

  @Field(() => [ID], {
    nullable: true,
  })
  @IsOptional()
  @IsArray()
  @IsUUID('all')
  hashtagIds?: string[];
}

@InputType()
export class PostFilterInput {
  @Field(() => ID, {
    nullable: true,
  })
  @IsOptional()
  @IsUUID()
  authorId?: string;

  @Field(() => ID, {
    nullable: true,
  })
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @Field(() => ID, {
    nullable: true,
  })
  @IsOptional()
  @IsUUID()
  locationId?: string;
}

@InputType()
export class PaginationInput {
  @Field(() => Int, {
    defaultValue: 1,
  })
  @IsInt()
  @Min(1)
  page!: number;

  @Field(() => Int, {
    defaultValue: 20,
  })
  @IsInt()
  @Min(1)
  @Max(100)
  limit!: number;
}