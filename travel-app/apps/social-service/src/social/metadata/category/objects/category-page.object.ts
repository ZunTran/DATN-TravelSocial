import { Field, Int, ObjectType } from '@nestjs/graphql';
import { CategoryObject } from './category.object';

@ObjectType()
export class CategoryPageObject {
  @Field(() => [CategoryObject])
  items!: CategoryObject[];

  @Field(() => Int)
  total!: number;

  @Field(() => Int)
  page!: number;

  @Field(() => Int)
  limit!: number;

  @Field(() => Int)
  totalPages!: number;

  @Field()
  hasNextPage!: boolean;
}