import {
  Field,
  InputType,
} from '@nestjs/graphql';

import {
  IsEnum,
} from 'class-validator';

import { UserReportStatus } from '../types/user-report-status.enum';

@InputType()
export class UpdateReportStatusInput {
  @Field(() => UserReportStatus)
  @IsEnum(UserReportStatus)
  status: UserReportStatus;
}