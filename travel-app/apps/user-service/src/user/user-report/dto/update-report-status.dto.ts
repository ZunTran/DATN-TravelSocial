import { IsEnum } from 'class-validator';
import { user_report_status } from '@prisma/client';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateReportStatusInput {
  @Field(() => String)
  @IsEnum(user_report_status)
  status: user_report_status;
}