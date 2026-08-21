import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ShareObject {
  @Field(() => ID)
  id!: string;

  @Field(() => ID)
  postId!: string;

  @Field(() => ID)
  userId!: string;

  @Field(() => Date)
  createdAt!: Date;
}
