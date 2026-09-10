import { Field, ID, InputType, Int } from "@nestjs/graphql";
import { IsInt, IsNotEmpty, IsOptional, IsString, IsUUID, Max, MaxLength, Min } from "class-validator";

@InputType()
export class CreateCategoryInput {
  @Field()
  @IsNotEmpty()
  @MaxLength(100)
  name!: string;

  @Field(() => String, {
    nullable: true,
  })
  @IsOptional()
  @MaxLength(500)
  description?: string;
}

@InputType()
export class UpdateCategoryInput {
  @Field(() => ID)
  @IsUUID()
  id!: string;

  @Field()
  @IsNotEmpty()
  @MaxLength(100)
  name!: string;

  @Field(() => String, {
    nullable: true,
  })
  @IsOptional()
  @MaxLength(500)
  description?: string;
}

@InputType()
export class CategoryFilterInput {
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
  @Max(100)
  limit!: number;
}