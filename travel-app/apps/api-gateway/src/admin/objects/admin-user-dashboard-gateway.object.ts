import {
  Field,
  Float,
  Int,
  ObjectType,
  GraphQLISODateTime,
} from '@nestjs/graphql';

@ObjectType()
export class UserStatisticsGatewayObject {
  @Field(() => Int)
  total!: number;

  @Field(() => Int)
  newUsers!: number;

  @Field(() => Int)
  active!: number;

  @Field(() => Int)
  banned!: number;

  @Field(() => Int)
  locked!: number;
}

@ObjectType()
export class SessionStatisticsGatewayObject {
  @Field(() => Int)
  sessions!: number;

  @Field(() => Int)
  uniqueUsers!: number;

  @Field(() => Int)
  activeSessions!: number;
}

@ObjectType()
export class RegistrationGrowthGatewayObject {
  @Field(() => Float)
  percentage!: number;

  @Field()
  trend!: string;
}

@ObjectType()
export class UserGrowthByDayGatewayObject {
  @Field(() => GraphQLISODateTime)
  date!: Date;

  @Field(() => Int)
  count!: number;
}

@ObjectType()
export class SessionActivityByDayGatewayObject {
  @Field(() => GraphQLISODateTime)
  date!: Date;

  @Field(() => Int)
  sessions!: number;

  @Field(() => Int)
  users!: number;
}

@ObjectType()
export class AdminUserDashboardGatewayObject {
  @Field(() => UserStatisticsGatewayObject)
  users!: UserStatisticsGatewayObject;

  @Field(() => SessionStatisticsGatewayObject)
  sessions!: SessionStatisticsGatewayObject;

  @Field(() => RegistrationGrowthGatewayObject)
  registrationGrowth!: RegistrationGrowthGatewayObject;

  @Field(() => [UserGrowthByDayGatewayObject])
  userGrowthByDay!: UserGrowthByDayGatewayObject[];

  @Field(() => [SessionActivityByDayGatewayObject])
  sessionActivityByDay!: SessionActivityByDayGatewayObject[];
}