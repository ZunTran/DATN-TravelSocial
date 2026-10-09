import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateInterestTagInput {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  icon_url?: string;
}