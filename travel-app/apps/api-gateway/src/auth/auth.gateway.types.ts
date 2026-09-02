import {
  Field,
  ID,
  ObjectType,
} from '@nestjs/graphql';

@ObjectType()
export class GatewayLoginResponse {
  @Field()
  accessToken: string;

 @Field({ nullable: true })
  refreshToken?: string;
}

@ObjectType()
export class GatewayLoginSession {
  @Field(() => ID)
  id: string;

  @Field({ nullable: true })
  deviceName?: string;

  @Field({ nullable: true })
  browser?: string;

  @Field({ nullable: true })
  os?: string;

  @Field({ nullable: true })
  ipAddress?: string;

  @Field()
  lastActiveAt: Date;

  @Field()
  isActive: boolean;
}