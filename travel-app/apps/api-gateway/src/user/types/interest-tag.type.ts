import {
  Field,
  ID,
  ObjectType,
  Int
} from '@nestjs/graphql';

@ObjectType()
export class GatewayInterestTag {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  icon_url?: string;

  @Field()
  created_at: string;
}

@ObjectType()
export class GatewayInterestPage {
  @Field(() => [GatewayInterestTag])
  data: GatewayInterestTag[];

  @Field(() => Int)
  total: number;

  @Field(() => Int)
  page: number;

  @Field(() => Int)
  limit: number;

  @Field(() => Int)
  totalPages: number;
}