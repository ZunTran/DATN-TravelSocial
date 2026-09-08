import {
  Field,
  ID,
  ObjectType,
} from '@nestjs/graphql';

@ObjectType()
export class GatewayUserProfile {
  @Field(() => ID)
  id: string;

  @Field()
  username: string;

  @Field()
  display_name: string;

  @Field({ nullable: true })
  avatar_url?: string;

  @Field({ nullable: true })
  cover_url?: string;

  @Field({ nullable: true })
  bio?: string;

  @Field({ nullable: true })
  gender?: string;

  @Field({ nullable: true })
  birthday?: string;

  @Field({ nullable: true })
  location?: string;

  @Field()
  privacy: string;

  @Field()
  isCompleted: boolean;

  @Field()
  created_at: string;

  @Field()
  updated_at: string;
}