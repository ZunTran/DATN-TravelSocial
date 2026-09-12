import { Field, Float, GraphQLISODateTime, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()

export class UserGrowthObject {
@Field(() => GraphQLISODateTime)
  date!: Date;

  @Field(() => Int)
  count!: number;
}

@ObjectType()
export class UserStatisticsObject {
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
export class SessionStatisticsObject {
  @Field(() => Int)
  sessions!: number;

  @Field(() => Int)
  uniqueUsers!: number;

  @Field(() => Int)
  activeSessions!: number;
}

@ObjectType()
export class SessionActivityObject {
  @Field(() => GraphQLISODateTime)
  date!: Date;

  @Field(() => Int)
  sessions!: number;

  @Field(() => Int)
  users!: number;
}

@ObjectType()
export class RegistrationGrowthObject {
  @Field(() => Float)
  percentage!: number;

  @Field()
  trend!: string;
}


@ObjectType()
export class UserGrowthSummaryObject {
  @Field(() => Float)
  percentage!: number;

  @Field()
  trend!: string;
}

@ObjectType()
export class AdminUserDashboardObject {
  @Field(() => UserStatisticsObject)
  users!: UserStatisticsObject;

  @Field(() => SessionStatisticsObject)
  sessions!: SessionStatisticsObject;

  @Field(() => RegistrationGrowthObject)
  registrationGrowth!: RegistrationGrowthObject;

  @Field(() => [UserGrowthObject])
  userGrowthByDay!: UserGrowthObject[];

  @Field(() => [SessionActivityObject])
  sessionActivityByDay!: SessionActivityObject[];
}