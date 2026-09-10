import { Field, InputType, Int } from '@nestjs/graphql';
import {
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

@InputType()
export class CategoryFilterInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  search?: string;

  @Field(() => Int, { defaultValue: 1 })
  @IsInt()
  @Min(1)
  page!: number;

  @Field(() => Int, { defaultValue: 20 })
  @IsInt()
  @Min(1)
  @Max(100)
  limit!: number;
}