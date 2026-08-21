import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ShareObject } from './share.object';

@ObjectType()
export class ShareList {
  @Field(() => [ShareObject])
  items: ShareObject[];

  @Field(() => Int)
  total: number;

  @Field(() => Int)
  page: number;

  @Field(() => Int)
  limit: number;

  @Field(() => Int)
  totalPages: number;
}