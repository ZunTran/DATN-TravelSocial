import {  Field,ID,InputType,Int} from '@nestjs/graphql';
import {IsArray,IsEnum,IsInt,IsOptional,IsString,IsUUID,Max,MaxLength,Min,ValidateNested} from 'class-validator';
import { Type } from 'class-transformer';
import {MediaType,PostPrivacy,PostStatus} from '@prisma/client';
import '../enums/post.enum';

@InputType()
export class UpdatePostMediaInput {
  @Field(() => String)
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

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(10000)
  content?: string;

  @Field(() => PostStatus, { nullable: true })
  @IsOptional()
  @IsEnum(PostStatus)
  status?: PostStatus;

  @Field(() => PostPrivacy, { nullable: true })
  @IsOptional()
  @IsEnum(PostPrivacy)
  privacy?: PostPrivacy;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsUUID()
  categoryId?: string | null;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsUUID()
  locationId?: string | null;

  @Field(() => [UpdatePostMediaInput], {
    nullable: true,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdatePostMediaInput)
  media?: UpdatePostMediaInput[];

  @Field(() => [ID], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsUUID('all')
  hashtagIds?: string[];
}