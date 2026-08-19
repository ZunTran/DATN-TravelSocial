import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CategoryObject {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field(() => String, { nullable: true })
  description?: string;
}