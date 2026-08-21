import { Field, Int, ObjectType } from '@nestjs/graphql';
import { LikeObject } from './like.object';

@ObjectType()
export class LikeList {
  @Field(() => [LikeObject])
  items: LikeObject[];

  @Field(() => Int)
  total: number;

  @Field(() => Int)
  page: number;

  @Field(() => Int)
  limit: number;

  @Field(() => Int)
  totalPages: number;
}