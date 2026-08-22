import { Field, Float, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class TravelPlanItemObject {
  @Field()
  id: string;

  @Field()
  travelPlanId: string;

  @Field(() => Int)
  dayIndex: number;

  @Field({ nullable: true })
  timeSlot: string | null;

  @Field()
  activityName: string;

  @Field({ nullable: true })
  locationId: string | null;

  @Field({ nullable: true })
  description: string | null;

  @Field(() => Float, { nullable: true })
  costEstimate: number | null;
}