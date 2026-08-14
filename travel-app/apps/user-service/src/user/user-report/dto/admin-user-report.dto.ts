import { IsEnum, IsOptional, Min } from 'class-validator';
import { user_report_status } from '@prisma/client';
import { Field, InputType, Int } from '@nestjs/graphql';

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

  @Field(() => String, {
    nullable: true,
  })
  @IsOptional()
  @IsEnum(user_report_status)
  status?: user_report_status;
}