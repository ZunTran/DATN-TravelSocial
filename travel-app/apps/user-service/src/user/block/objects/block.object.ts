import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class BlockObject {
  @Field(() => ID)
  blocker_id: string;

  @Field(() => ID)
  blocked_id: string;

  @Field({ nullable: true })
  reason?: string;

  @Field()
  created_at: Date;
}