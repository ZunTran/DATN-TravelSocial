import {
  Field,
  ID,
  InputType,
} from '@nestjs/graphql';
import { TravelPlanStatus } from '@prisma/client';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

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

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  input?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  content?: string;

  @Field(() => TravelPlanStatus, { nullable: true })
  @IsOptional()
  @IsEnum(TravelPlanStatus)
  status?: TravelPlanStatus;
}