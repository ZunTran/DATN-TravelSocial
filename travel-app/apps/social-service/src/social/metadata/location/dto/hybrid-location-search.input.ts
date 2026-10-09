import { Field, Float, InputType, Int } from '@nestjs/graphql';

@InputType()
export class HybridLocationSearchInput {
  @Field()
  query: string;

  @Field({ nullable: true })
  province?: string;

  @Field({ nullable: true })
  category?: string;

  @Field(() => Float, { nullable: true })
  minCost?: number;

  @Field(() => Float, { nullable: true })
  maxCost?: number;

  @Field(() => Int, { nullable: true })
  minDuration?: number;

  @Field(() => Int, { nullable: true })
  maxDuration?: number;

  @Field(() => Int, { nullable: true, defaultValue: 10 })
  limit?: number;
}