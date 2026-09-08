import { Field, InputType } from '@nestjs/graphql';
import {
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

import {
  gender_type,
  user_privacy,
} from '@prisma/client';

@InputType()
export class UpdateProfileInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  username?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(100, {
    message: 'Display name tối đa 100 ký tự',
  })
  display_name?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  avatar_url?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  cover_url?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  bio?: string;

  @Field(() => gender_type, { nullable: true })
  @IsOptional()
  @IsEnum(gender_type)
  gender?: gender_type;

  @Field({ nullable: true })
  @IsOptional()
  birthday?: Date;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  location?: string;

  @Field(() => user_privacy, { nullable: true })
  @IsOptional()
  @IsEnum(user_privacy)
  privacy?: user_privacy;

}