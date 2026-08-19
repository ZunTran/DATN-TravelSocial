import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class HashtagObject {
  @Field(() => ID)
  id!: string;

  @Field()
  name!: string;
}
