import {
  Field,
  ID,
  Int,
  ObjectType,
} from '@nestjs/graphql';

@ObjectType()
export class GatewayCategoryObject {
  @Field(() => ID)
  id!: string;

  @Field()
  name!: string;

  @Field(() => String, {
    nullable: true,
  })
  description?: string | null;
}

@ObjectType()
export class GatewayCategoryPageObject {
  @Field(() => [GatewayCategoryObject])
  items!: GatewayCategoryObject[];

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