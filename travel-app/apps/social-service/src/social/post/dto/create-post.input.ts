import {Field,ID,InputType} from '@nestjs/graphql';
import {IsArray,IsEnum,IsOptional,IsString,IsUUID,MaxLength} from 'class-validator';
import {PostPrivacy,PostStatus} from '@prisma/client';
import { CreatePostMediaInput } from './create-post-media.input';
import '../enums/post.enum';

@InputType()
export class CreatePostInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(10000)
  content?: string;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @Field(() => ID, { nullable: true })
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

  @Field(() => [ID], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsUUID('all')
  hashtagIds?: string[];

  @Field(() => [CreatePostMediaInput], { nullable: true })
  @IsOptional()
  @IsArray()
  media?: CreatePostMediaInput[];
}