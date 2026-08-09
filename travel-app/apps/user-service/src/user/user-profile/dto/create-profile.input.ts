import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsOptional, MaxLength } from 'class-validator';

@InputType()
export class CreateProfileInput {
  @Field()
  @IsNotEmpty({ message: 'Username không được để trống' })
  @IsString()
  @MaxLength(50, { message: 'Username tối đa 50 ký tự' })
  username: string;

  @Field()
  @IsNotEmpty({ message: 'Display name không được để trống' })
  @IsString()
  @MaxLength(100, { message: 'Display name tối đa 100 ký tự' })
  display_name: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  avatar_url?: string;
}