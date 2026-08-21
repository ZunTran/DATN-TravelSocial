import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CommentObject {
  @Field(() => ID)
  id!: string;

  @Field(() => ID)
  postId!: string;

  @Field(() => ID)
  authorId!: string;

  @Field(() => ID, { nullable: true })
  parentCommentId!: string | null;

  @Field(() => String)
  content!: string;

  @Field(() => Date)
  createdAt!: Date;
}
