import { Field, InputType } from '@nestjs/graphql';
import { IsArray, IsUUID } from 'class-validator';

@InputType()
export class UpdateUserInterestsInput {
  @Field(() => [String])
  @IsArray()
  @IsUUID('4', { each: true, message: 'Mỗi interest_id phải là định dạng UUID hợp lệ' })
  interestIds: string[];
}