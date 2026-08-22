import { Field, Float, Int, InputType } from '@nestjs/graphql';

@InputType()
export class CreateTravelPlanItemInlineInput {
  @Field(() => Int)
  dayIndex: number;

  @Field({ nullable: true })
  timeSlot?: string;

  @Field()
  activityName: string;

  @Field({ nullable: true })
  locationId?: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => Float, { nullable: true })
  costEstimate?: number;
}