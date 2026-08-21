import { Field, ID, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

@InputType()
export class CreateCommentInput {
  @Field(() => ID)
  @IsUUID()
  postId!: string;

  @Field(() => String)
  @IsNotEmpty()
  content!: string;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsUUID()
  parentCommentId?: string;
}

