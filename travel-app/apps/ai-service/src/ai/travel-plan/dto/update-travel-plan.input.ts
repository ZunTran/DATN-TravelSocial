import {
  Field,
  ID,
  InputType,
} from '@nestjs/graphql';

import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

import { TravelPlanStatus } from '../../enums/travel-plan-status.enum';

@InputType()
export class UpdateTravelPlanInput {
  @Field(() => ID)
  @IsUUID()
  id: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  destination?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  input?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  content?: string;

  @Field(() => TravelPlanStatus, {
    nullable: true,
  })
  @IsOptional()
  @IsEnum(TravelPlanStatus)
  status?: TravelPlanStatus;
}