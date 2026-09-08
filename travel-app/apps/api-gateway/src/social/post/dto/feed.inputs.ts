import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class FeedInput {
  @Field({ nullable: true })
  cursor?: string;

  @Field(() => Int, { defaultValue: 10 })
  limit: number = 10;
}