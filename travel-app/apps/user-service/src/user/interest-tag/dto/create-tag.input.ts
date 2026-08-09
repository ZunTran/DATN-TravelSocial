import { Field, InputType } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

@InputType()
export class CreateInterestTagInput {
  @Field()
  @IsNotEmpty({
    message: 'Tên interest không được để trống',
  })
  @IsString()
  @MaxLength(100, {
    message: 'Tên interest tối đa 100 ký tự',
  })
  name: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  icon_url?: string;
}