import {
  Field,
  Int,
  ObjectType,
} from '@nestjs/graphql';

import { HashtagObject } from './hashtag.object';

@ObjectType()
export class HashtagPageObject {
  @Field(() => [HashtagObject])
  items!: HashtagObject[];

  @Field(() => Int)
  total!: number;

  @Field(() => Int)
  page!: number;

  @Field(() => Int)
  limit!: number;

  @Field(() => Int)
  totalPages!: number;

  @Field()
  hasNextPage!: boolean;
}