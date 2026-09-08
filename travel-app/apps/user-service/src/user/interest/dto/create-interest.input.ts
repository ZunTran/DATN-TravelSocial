import { Field, InputType } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

@InputType()
export class CreateInterestInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  icon_url?: string;
}

@InputType()
export class UpdateInterestInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  icon_url?: string;
}