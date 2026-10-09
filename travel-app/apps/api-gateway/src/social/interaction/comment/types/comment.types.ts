import {
  Field,
  ID,
  Int,
  ObjectType,
} from '@nestjs/graphql';

@ObjectType()
export class GatewayCommentAuthor {
  @Field(() => ID)
  id!: string;

  @Field(() => String)
  username!: string;

  @Field(() => String, {
    nullable: true,
  })
  avatarUrl!: string | null;
}

@ObjectType()
export class GatewayComment {
  @Field(() => ID)
  id!: string;

  @Field(() => ID)
  postId!: string;

  @Field(() => ID)
  authorId!: string;

  @Field(() => GatewayCommentAuthor)
  author!: GatewayCommentAuthor;

  @Field(() => ID, {
    nullable: true,
  })
  parentCommentId!: string | null;

  @Field(() => String)
  content!: string;

  @Field(() => Date)
  createdAt!: Date;
}

@ObjectType()
export class GatewayCommentList {
  @Field(() => [GatewayComment])
  items!: GatewayComment[];

  @Field(() => Int)
  total!: number;

  @Field(() => Int)
  page!: number;

  @Field(() => Int)
  limit!: number;

  @Field(() => Int)
  totalPages!: number;

  @Field(() => Boolean)
  hasNextPage!: boolean;
}