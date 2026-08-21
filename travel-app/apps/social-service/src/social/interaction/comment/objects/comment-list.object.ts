import { Field, Int, ObjectType } from '@nestjs/graphql';
import { CommentObject } from './comment.object';

@ObjectType()
export class CommentList {
  @Field(() => [CommentObject])
  items: CommentObject[];

  @Field(() => Int)
  total: number;

  @Field(() => Int)
  page: number;

  @Field(() => Int)
  limit: number;

  @Field(() => Int)
  totalPages: number;
}