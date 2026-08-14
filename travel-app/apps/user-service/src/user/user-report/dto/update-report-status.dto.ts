import { IsEnum } from 'class-validator';
import { user_report_status } from '@prisma/client';
import { Field, InputType, registerEnumType } from '@nestjs/graphql';

registerEnumType(user_report_status, {
  name: 'UserReportStatus',
});

@InputType()
export class UpdateReportStatusInput {
  @Field(() => user_report_status)
  @IsEnum(user_report_status)
  status: user_report_status;
}