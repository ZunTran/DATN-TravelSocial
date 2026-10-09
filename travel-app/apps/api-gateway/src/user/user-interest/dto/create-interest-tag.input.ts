import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateInterestTagInput {
  @Field()
  name: string;

  @Field({ nullable: true })
  icon_url?: string;
}