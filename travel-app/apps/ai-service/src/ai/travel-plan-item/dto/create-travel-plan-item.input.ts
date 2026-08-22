import { Field, Float, InputType, Int } from '@nestjs/graphql';
import {
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  IsNumber,
} from 'class-validator';

@InputType()
export class CreateTravelPlanItemInput {
  @Field()
  @IsUUID()
  travelPlanId: string;

  @Field(() => Int)
  @IsInt()
  @Min(1)
  dayIndex: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  timeSlot?: string;

  @Field()
  @IsString()
  activityName: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsUUID()
  locationId?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  costEstimate?: number;
}