import { Field, Int, ObjectType } from '@nestjs/graphql';
import { TravelPlanObject } from './travel-plan.object';

@ObjectType()
export class TravelPlanList {
  @Field(() => [TravelPlanObject])
  items: TravelPlanObject[];

  @Field(() => Int)
  total: number;

  @Field(() => Int)
  page: number;

  @Field(() => Int)
  limit: number;

  @Field(() => Int)
  totalPages: number;
}
