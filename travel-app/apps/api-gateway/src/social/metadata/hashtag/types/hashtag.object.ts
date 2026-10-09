import { Field, ObjectType, Int, ID } from "@nestjs/graphql";


@ObjectType()
export class AdminHashtagObject {
  @Field(() => ID)
  id!: string;

  @Field()
  name!: string;

  @Field(() => Int)
  postCount!: number;
}

@ObjectType()
export class AdminHashtagListObject {
  @Field(() => [AdminHashtagObject])
  items!: AdminHashtagObject[];

  @Field(() => Int)
  total!: number;

  @Field(() => Int)
  page!: number;

  @Field(() => Int)
  limit!: number;

  @Field(() => Int)
  totalPages!: number;
}

@ObjectType()
export class HashtagObject {
  @Field(() => ID)
  id!: string;

  @Field()
  name!: string;
}

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

  @Field(() => Boolean)
  hasNextPage!: boolean;
}