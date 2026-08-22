import { Field, Float, InputType, Int, PartialType } from '@nestjs/graphql';
import {
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

@InputType()
export class UpdateTravelPlanItemInput {
  @Field()
  id: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(1)
  dayIndex?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  timeSlot?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  activityName?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
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