import {
  Field,
  ID,
  ObjectType,
} from '@nestjs/graphql';

@ObjectType()
export class GatewayFollow {
  @Field(() => ID)
  follower_id: string;

  @Field(() => ID)
  following_id: string;

  @Field()
  created_at: string;
}