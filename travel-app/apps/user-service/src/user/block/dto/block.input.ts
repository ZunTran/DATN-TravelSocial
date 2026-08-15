import { Field, ID, InputType } from '@nestjs/graphql';
import {IsOptional,IsString,MaxLength,IsUUID, IsNotEmpty} from 'class-validator';

@InputType()
export class BlockInput {
  @Field(() => ID)
  @IsUUID()
  @IsNotEmpty()
  profileId: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  reason?: string;
}
