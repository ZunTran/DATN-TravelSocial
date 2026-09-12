import { Field, Int, ObjectType } from '@nestjs/graphql';
import { LocationObject } from './location.object';

@ObjectType()
export class LocationPageObject {
  @Field(() => [LocationObject])
  items!: LocationObject[];

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