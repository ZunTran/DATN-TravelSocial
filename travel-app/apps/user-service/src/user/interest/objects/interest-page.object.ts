import {
  Field,
  Int,
  ObjectType,
} from '@nestjs/graphql';

import { InterestTagObject } from './interest.object';

@ObjectType()
export class InterestPageObject {
  @Field(() => [InterestTagObject])
  data: InterestTagObject[];

  @Field(() => Int)
  total: number;

  @Field(() => Int)
  page: number;

  @Field(() => Int)
  limit: number;

  @Field(() => Int)
  totalPages: number;
}