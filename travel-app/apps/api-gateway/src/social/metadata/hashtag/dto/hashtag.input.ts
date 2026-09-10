import { Field, ID, InputType, Float } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsUUID ,IsNumber,MaxLength} from 'class-validator';

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