

import { Field, ID, InputType, Float } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsUUID ,IsNumber,MaxLength} from 'class-validator';

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
export class CreateLocationInput {
  @Field()
  @IsNotEmpty()
  @MaxLength(255)
  name!: string;

  @Field(() => String, {
    nullable: true,
  })
  @IsOptional()
  address?: string;

  @Field(() => Float, {
    nullable: true,
  })
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @Field(() => Float, {
    nullable: true,
  })
  @IsOptional()
  @IsNumber()
  longitude?: number;

  @Field(() => String, {
    nullable: true,
  })
  @IsOptional()
  @MaxLength(100)
  province?: string;
}

@InputType()
export class UpdateLocationInput {
  @Field(() => ID)
  @IsUUID()
  id!: string;

  @Field()
  @IsNotEmpty()
  @MaxLength(255)
  name!: string;

  @Field(() => String, {
    nullable: true,
  })
  @IsOptional()
  address?: string;

  @Field(() => Float, {
    nullable: true,
  })
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @Field(() => Float, {
    nullable: true,
  })
  @IsOptional()
  @IsNumber()
  longitude?: number;

  @Field(() => String, {
    nullable: true,
  })
  @IsOptional()
  @MaxLength(100)
  province?: string;
}

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