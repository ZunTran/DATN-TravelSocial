import {Field,
  InputType,
  Int
} from '@nestjs/graphql';
import { user_report_status } from '@prisma/client';

import {
  IsEnum,
  IsOptional,
  Min,
} from 'class-validator';

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