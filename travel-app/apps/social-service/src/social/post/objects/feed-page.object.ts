import { Field, ObjectType } from '@nestjs/graphql';
import { PostObject } from './post.object';

@ObjectType()
export class FeedPageObject {
  @Field(() => [PostObject])
  items: PostObject[];

  @Field()
  hasNextPage: boolean;

 @Field(() => String, { nullable: true })
  endCursor?: string;
}