import { Field, Int, ObjectType } from "@nestjs/graphql";
import { RecommendationLogObject } from "./recommendation.object";

@ObjectType()
export class RecommendationLogList {
  @Field(() => [RecommendationLogObject])
  items: RecommendationLogObject[];

  @Field(() => Int)
  total: number;

  @Field(() => Int)
  page: number;

  @Field(() => Int)
  limit: number;

  @Field(() => Int)
  totalPages: number;
}
