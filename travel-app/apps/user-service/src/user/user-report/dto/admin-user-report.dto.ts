import {Field,
  InputType,
  Int,
  registerEnumType,
} from '@nestjs/graphql';

import {
  IsEnum,
  IsOptional,
  Min,
} from 'class-validator';

import { user_report_status } from '@prisma/client';

registerEnumType(user_report_status, {
  name: 'UserReportStatus',
});

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

  @Field(() => user_report_status, {
    nullable: true,
  })
  @IsOptional()
  @IsEnum(user_report_status)
  status?: user_report_status;
}