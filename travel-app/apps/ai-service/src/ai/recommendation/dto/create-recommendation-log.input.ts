import {Field, Float, ID, InputType} from '@nestjs/graphql';
import { IsEnum, IsNumber,IsOptional, IsUUID} from 'class-validator';
import { RecommendationType } from '../../enums/recommendation-type.enum';

@InputType()
export class CreateRecommendationLogInput {
  @Field(() => RecommendationType)
  @IsEnum(RecommendationType)
  type: RecommendationType;

  @Field(() => ID)
  @IsUUID()
  referenceId: string;

  @Field(() => Float, {
    nullable: true,
  })
  @IsOptional()
  @IsNumber()
  score?: number;
}
