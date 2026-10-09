import { Field, ID, InputType, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsUUID ,MaxLength, IsInt, IsString, Min, Max} from 'class-validator';

@InputType()
export class CreateHashtagInput {
  @Field()
  @IsNotEmpty()
  @MaxLength(100)
  name!: string;
}

@InputType()
export class UpdateHashtagInput {
  @Field(() => ID)
  @IsUUID()
  id!: string;

  @Field()
  @IsNotEmpty()
  @MaxLength(100)
  name!: string;
}

@InputType()
export class AdminHashtagFilterInput {
  @Field(() => String, {
    nullable: true,
  })
  search?: string;

  @Field(() => Number, {
    defaultValue: 1,
  })
  page!: number;

  @Field(() => Number, {
    defaultValue: 20,
  })
  limit!: number;
}

@InputType()
export class HashtagFilterInput {
  @Field(() => String, {
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  search?: string;

  @Field(() => Int, {
    defaultValue: 1,
  })
  @IsInt()
  @Min(1)
  page!: number;

  @Field(() => Int, {
    defaultValue: 20,
  })
  @IsInt()
  @Min(1)
  @Max(50)
  limit!: number;
}