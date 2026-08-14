import { Field, Int, ObjectType } from '@nestjs/graphql';
import { UserReportObject } from './user-report.object';

@ObjectType()
export class UserReportPageObject {
  @Field(() => [UserReportObject])
  data: UserReportObject[];

  @Field(() => Int)
  total: number;

  @Field(() => Int)
  page: number;

  @Field(() => Int)
  limit: number;

  @Field(() => Int)
  totalPages: number;
}