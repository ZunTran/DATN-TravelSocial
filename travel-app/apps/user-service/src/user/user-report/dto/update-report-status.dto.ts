import { IsEnum } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';
import { user_report_status } from '../types/user-report-status.enum';

@InputType()
export class UpdateReportStatusInput {
  @Field(() => user_report_status)
  @IsEnum(user_report_status)
  status: user_report_status;
}