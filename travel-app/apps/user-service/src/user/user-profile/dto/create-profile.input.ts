import { Field, InputType } from '@nestjs/graphql';
import { gender_type } from '@prisma/client';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

@InputType()
export class CreateProfileInput {
  @Field()
  @IsNotEmpty({ message: 'Username không được để trống' })
  @IsString()
  @MaxLength(50, {
    message: 'Username tối đa 50 ký tự',
  })
  username: string;

  @Field()
  @IsNotEmpty({ message: 'Display name không được để trống' })
  @IsString()
  @MaxLength(100, {
    message: 'Display name tối đa 100 ký tự',
  })
  display_name: string;

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

  @Field({ nullable: true })
  @IsOptional()
  birthday?: Date;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  location?: string;

  @Field(() => gender_type, { nullable: true })
  @IsOptional()
  @IsEnum(gender_type)
  gender?: gender_type;
  
}