import { Field, Int, ObjectType } from '@nestjs/graphql';
import { UserProfileObject } from '../../user-profile/objects/user-profile.object';

@ObjectType()
export class BlockPageObject {
  @Field(() => [UserProfileObject])
  data: UserProfileObject[];

  @Field(() => Int)
  total: number;

  @Field(() => Int)
  page: number;

  @Field(() => Int)
  limit: number;

  @Field(() => Int)
  totalPages: number;
}