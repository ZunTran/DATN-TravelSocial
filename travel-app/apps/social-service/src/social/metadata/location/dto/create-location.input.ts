import { Field, Float, InputType } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  MaxLength,
} from 'class-validator';

@InputType()
export class CreateLocationInput {
  @Field()
  @IsNotEmpty()
  @MaxLength(255)
  name!: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  address?: string | null;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  latitude?: number | null;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  longitude?: number | null;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @MaxLength(100)
  province?: string | null;
}