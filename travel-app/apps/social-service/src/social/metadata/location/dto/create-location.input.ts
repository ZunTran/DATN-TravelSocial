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

  @Field({ nullable: true })
  @IsOptional()
  address?: string;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  longitude?: number;

  @Field({ nullable: true })
  @IsOptional()
  @MaxLength(100)
  province?: string;
}
