import {
  Field,
  ID,
  Int,
  ObjectType,
} from '@nestjs/graphql';

import { MediaType } from '@prisma/client';

import '../enums/post.enum';

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