import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

@InputType()
export class CreateInterestInput {
  @Field()
  @IsNotEmpty({ message: 'Tên sở thích không được để trống' })
  @IsString()
  @MaxLength(100)
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
  @MaxLength(100)
  name?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  icon_url?: string;
}