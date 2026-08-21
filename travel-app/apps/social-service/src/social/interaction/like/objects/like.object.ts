import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class LikeObject {
  @Field(() => ID)
  postId!: string;

  @Field(() => ID)
  userId!: string;

  @Field(() => Date)
  createdAt!: Date;
}
