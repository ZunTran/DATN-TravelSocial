import { Field, ObjectType } from '@nestjs/graphql';
import { PostObject } from './post.types';

@ObjectType()
export class FeedPageObject {
  @Field(() => [PostObject])
  items: PostObject[];

  @Field()
  hasNextPage: boolean;

  @Field(() => String, { nullable: true })
  endCursor: string | null;
}