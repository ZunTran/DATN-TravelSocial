import {
  Field,
  ID,
  Int,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';

import { TravelPlanItemObject } from './travel-plan-item.type';

export enum TravelPlanStatus {
  ACTIVE = 'ACTIVE',
  DELETED = 'DELETED',
}

registerEnumType(TravelPlanStatus, {
  name: 'TravelPlanStatus',
});

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

@Field(() => String)
createdAt: string;

@Field(() => String)
updatedAt: string;

  @Field(() => [TravelPlanItemObject])
  items: TravelPlanItemObject[];
}

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