import { Field, InputType } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

@InputType()
export class UpdateInterestTagInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  name?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  icon_url?: string;
}