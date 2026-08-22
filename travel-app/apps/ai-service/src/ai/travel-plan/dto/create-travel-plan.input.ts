import {
  Field,
  InputType,
} from '@nestjs/graphql';

import {
  IsNotEmpty,
  IsString,
} from 'class-validator';

import { CreateTravelPlanItemInput } from '../../travel-plan-item/dto/create-travel-plan-item.input';

@InputType()
export class CreateTravelPlanInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  title: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  destination: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  input: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  content: string;

  @Field(() => [CreateTravelPlanItemInput], {
    nullable: true,
  })
  items?: CreateTravelPlanItemInput[];
}