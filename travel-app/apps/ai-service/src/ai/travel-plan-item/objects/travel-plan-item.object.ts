import { Field, Float, ID, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class TravelPlanItemObject {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  travelPlanId: string;

  @Field(() => Int)
  dayIndex: number;

  @Field(() => String, { nullable: true })
  timeSlot: string | null;

  @Field(() => String)
  activityName: string;

  @Field(() => ID, { nullable: true })
  locationId: string | null;

  @Field(() => String, { nullable: true })
  description: string | null;

  @Field(() => Float, { nullable: true })
  costEstimate: number | null;
}