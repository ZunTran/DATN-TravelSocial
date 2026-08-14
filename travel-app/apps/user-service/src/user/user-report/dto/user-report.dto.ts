import { Field, ID, InputType } from '@nestjs/graphql';
import {IsNotEmpty,IsString,MaxLength} from 'class-validator';

@InputType()
export class UserReportInput {
  @Field(() => ID)
  @IsNotEmpty()
  reportedUserId: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  reason: string;
}