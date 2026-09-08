import {
  Field,
  InputType,
} from '@nestjs/graphql';

@InputType()
export class GatewayUpdateProfileInput {
  @Field({ nullable: true })
  username?: string;

  @Field({ nullable: true })
  display_name?: string;

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

  @Field({ nullable: true })
  privacy?: string;
}