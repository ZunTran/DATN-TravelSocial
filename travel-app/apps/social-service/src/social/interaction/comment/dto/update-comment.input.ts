import { Field, ID, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsUUID } from 'class-validator';

@InputType()
export class UpdateCommentInput {
  @Field(() => ID)
  @IsUUID()
  id!: string;

  @Field(() => String)
  @IsNotEmpty()
  content!: string;
}
