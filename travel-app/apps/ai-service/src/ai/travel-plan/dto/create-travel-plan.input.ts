import {
  Field,
  InputType,
} from '@nestjs/graphql';

import {
  IsNotEmpty,
  IsString,
} from 'class-validator';

import { CreateTravelPlanItemInlineInput } from '../../travel-plan-item/dto/create-travel-plan-item-inline.input';

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

  @Field(() => [CreateTravelPlanItemInlineInput], {
    nullable: true,
  })
  items?: CreateTravelPlanItemInlineInput[];
}