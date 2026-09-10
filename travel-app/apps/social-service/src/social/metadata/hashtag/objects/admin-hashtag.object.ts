import { Field, ID, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AdminHashtagObject {
  @Field(() => ID)
  id!: string;

  @Field(() => String)
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