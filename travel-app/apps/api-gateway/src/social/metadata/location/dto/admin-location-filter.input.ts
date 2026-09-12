import {
  Field,
  InputType,
  Int,
} from '@nestjs/graphql';

import {
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

@InputType()
export class AdminLocationFilterInput {
  @Field({
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  search?: string;

  @Field({
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  province?: string;

  @Field(() => Int, {
    defaultValue: 1,
  })
  @IsInt()
  @Min(1)
  page = 1;

  @Field(() => Int, {
    defaultValue: 20,
  })
  @IsInt()
  @Min(1)
  @Max(50)
  limit = 20;
}