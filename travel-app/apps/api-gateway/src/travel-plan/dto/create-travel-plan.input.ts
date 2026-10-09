
import {
  Field,
  Float,
  InputType,
  Int,
} from '@nestjs/graphql';

import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

@InputType()
export class CreateTravelPlanInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  destination: string;

  @Field(() => Int)
  @IsInt()
  @Min(1)
  @Max(30)
  numberOfDays: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  province?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  category?: string;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  minCost?: number;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  maxCost?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  minDuration?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  maxDuration?: number;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  interests?: string[];

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  travelStyle?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  query?: string;

  @Field(() => Int, {
    nullable: true,
    defaultValue: 10,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(20)
  limit?: number;
}