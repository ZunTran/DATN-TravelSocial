import {
  Field,
  ID,
  ObjectType,
} from '@nestjs/graphql';

import { TravelPlanStatus } from '../../enums/travel-plan-status.enum';
import { TravelPlanItemObject } from '../../travel-plan-item/objects/travel-plan-item.object';

@ObjectType()
export class TravelPlanObject {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  userId: string;

  @Field()
  title: string;

  @Field()
  destination: string;

  @Field()
  input: string;

  @Field()
  content: string;

  @Field(() => TravelPlanStatus)
  status: TravelPlanStatus;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => [TravelPlanItemObject])
  items: TravelPlanItemObject[];
}