import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class InterestTagObject {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  icon_url?: string;

  @Field()
  created_at: Date;
}