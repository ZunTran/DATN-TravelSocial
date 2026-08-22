import { Field, Float, ID, ObjectType } from "@nestjs/graphql";
import { RecommendationType } from '../../enums/recommendation-type.enum';

@ObjectType()
export class RecommendationLogObject {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  userId: string;

  @Field(() => RecommendationType)
  type: RecommendationType;

  @Field(() => ID)
  referenceId: string;

  @Field(() => Float, { nullable: true })
  score: number | null;

  @Field()
  createdAt: Date;
}
