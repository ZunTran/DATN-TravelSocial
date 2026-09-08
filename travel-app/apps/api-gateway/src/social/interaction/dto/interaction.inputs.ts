import { Field, ID, InputType, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

@InputType()
export class CreateCommentInput {
  @Field(() => ID)
  @IsUUID()
  postId!: string;

  @Field()
  @IsNotEmpty()
  content!: string;

  @Field(() => ID, {
    nullable: true,
  })
  @IsOptional()
  @IsUUID()
  parentCommentId?: string;
}

@InputType()
export class UpdateCommentInput {
  @Field(() => ID)
  @IsUUID()
  id!: string;

  @Field()
  @IsNotEmpty()
  content!: string;
}

@InputType()
export class GatewayPaginationInput {
  @Field(() => Int, {
    defaultValue: 1,
  })
  page: number;

  @Field(() => Int, {
    defaultValue: 20,
  })
  limit: number;
}