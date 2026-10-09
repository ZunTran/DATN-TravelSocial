import {
  Field,
  InputType,
  Int,
} from '@nestjs/graphql';

import {
  IsEnum,
  IsOptional,
  Min,
} from 'class-validator';

import { UserReportStatus } from '../types/user-report-status.enum';

@InputType()
export class GetUserReportsInput {
  @Field(() => Int, {
    defaultValue: 1,
  })
  @Min(1)
  page: number;

  @Field(() => Int, {
    defaultValue: 20,
  })
  @Min(1)
  limit: number;

  @Field(() => UserReportStatus, {
    nullable: true,
  })
  @IsOptional()
  @IsEnum(UserReportStatus)
  status?: UserReportStatus;
}