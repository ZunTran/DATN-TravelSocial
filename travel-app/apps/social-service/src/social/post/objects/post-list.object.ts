import {
  Field,
  Int,
  ObjectType,
} from '@nestjs/graphql';

import { PostObject } from './post.object';

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