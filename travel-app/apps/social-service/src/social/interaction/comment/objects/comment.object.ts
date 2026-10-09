import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CommentAuthorObject {
  @Field(() => ID)
  id!: string;

  @Field(() => String)
  username!: string;

  @Field(() => String, { nullable: true })
  avatarUrl!: string | null;
}

@ObjectType()
export class CommentObject {
  @Field(() => ID)
  id!: string;

  @Field(() => ID)
  postId!: string;

  @Field(() => ID)
  authorId!: string;

  @Field(() => CommentAuthorObject)
  author!: CommentAuthorObject;

  @Field(() => ID, { nullable: true })
  parentCommentId!: string | null;

  @Field(() => String)
  content!: string;

  @Field(() => Date)
  createdAt!: Date;
}
