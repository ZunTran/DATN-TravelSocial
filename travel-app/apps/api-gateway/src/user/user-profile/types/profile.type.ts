import {
  Field,
  ID,
  Int,
  ObjectType,
  GraphQLISODateTime,
} from '@nestjs/graphql';

@ObjectType()
export class GatewayUserProfile {
  @Field(() => ID)
  id: string;

  @Field()
  username: string;

  @Field()
  display_name: string;

  @Field({
    nullable: true,
  })
  avatar_url?: string;

  @Field({
    nullable: true,
  })
  cover_url?: string;

  @Field({
    nullable: true,
  })
  bio?: string;

  @Field({
    nullable: true,
  })
  gender?: string;

  @Field(() => GraphQLISODateTime, {
    nullable: true,
  })
  birthday?: Date | null;

  @Field({ nullable: true})
  location?: string;

  @Field({nullable: true })
  privacy?: string;

  @Field({nullable: true })
  isCompleted?: boolean;

  @Field(() => GraphQLISODateTime, { nullable: true })
  created_at?: Date | null;

  @Field(() => GraphQLISODateTime, { nullable: true })
  updated_at?: Date | null;

  @Field(() => Int, {nullable: true })
  commonInterestsCount?: number;
}

@ObjectType()
export class GatewayUserProfilePageObject {
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