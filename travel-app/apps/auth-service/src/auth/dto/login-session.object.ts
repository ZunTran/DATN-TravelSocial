import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class LoginSession {
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