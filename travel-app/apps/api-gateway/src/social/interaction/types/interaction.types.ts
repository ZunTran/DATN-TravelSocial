import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { GatewayUserProfile } from '../../../user/user-profile/types/profile.type';

@ObjectType()
export class LikeObject {
  @Field(() => ID)
  postId!: string;

  @Field(() => ID)
  userId!: string;

  @Field(() => String)
  createdAt!: string;
}

@ObjectType()
export class LikeList {
  @Field(() => [LikeObject])
  items!: LikeObject[];

  @Field(() => Int)
  total!: number;

  @Field(() => Int)
  page!: number;

  @Field(() => Int)
  limit!: number;

  @Field(() => Int)
  totalPages!: number;
}

@ObjectType()
export class SavePostObject {
  @Field(() => ID)
  postId!: string;

  @Field(() => ID)
  userId!: string;

  @Field(() => String)
  savedAt!: string;
}

@ObjectType()
export class ShareObject {
  @Field(() => ID)
  id!: string;

  @Field(() => ID)
  postId!: string;

  @Field(() => ID)
  userId!: string;

  @Field(() => String)
  createdAt!: string;
}

@ObjectType()
export class ShareList {
  @Field(() => [ShareObject])
  items!: ShareObject[];

  @Field(() => Int)
  total!: number;

  @Field(() => Int)
  page!: number;

  @Field(() => Int)
  limit!: number;

  @Field(() => Int)
  totalPages!: number;
}

@ObjectType()
export class GatewayFollowPage {
  @Field(() => [GatewayUserProfile])
  data: GatewayUserProfile[];

  @Field(() => Int)
  total: number;

  @Field(() => Int)
  page: number;

  @Field(() => Int)
  limit: number;

  @Field(() => Int)
  totalPages: number;
}