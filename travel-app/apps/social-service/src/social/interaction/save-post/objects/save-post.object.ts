import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class SavePostObject {
  @Field(() => ID)
  postId!: string;

  @Field(() => ID)
  userId!: string;

  @Field(() => Date)
  savedAt!: Date;
}
