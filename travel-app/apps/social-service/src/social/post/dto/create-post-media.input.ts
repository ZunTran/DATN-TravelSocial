import {Field,InputType,Int} from '@nestjs/graphql';
import {IsEnum,IsInt,IsOptional,Max,Min} from 'class-validator';
import { MediaType } from '@prisma/client';
import '../enums/post.enum';

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