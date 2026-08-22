import { Field, Int, ObjectType } from '@nestjs/graphql';
import { TravelPlanItemObject } from './travel-plan-item.object';

@ObjectType()
export class TravelPlanItemList {
  @Field(() => [TravelPlanItemObject])
  items: TravelPlanItemObject[];

  @Field(() => Int)
  total: number;

  @Field(() => Int)
  page: number;

  @Field(() => Int)
  limit: number;

  @Field(() => Int)
  totalPages: number;
}