import {
  Field,
  ID,
  InputType,
} from '@nestjs/graphql';

import {
  IsNotEmpty,
  IsOptional,
  IsUUID,
} from 'class-validator';

@InputType('CreateCommentInput')
export class GatewayCreateCommentInput {
  @Field(() => ID)
  @IsUUID()
  postId!: string;

  @Field(() => String)
  @IsNotEmpty()
  content!: string;

  @Field(() => ID, {
    nullable: true,
  })
  @IsOptional()
  @IsUUID()
  parentCommentId?: string;
}

@InputType('UpdateCommentInput')
export class GatewayUpdateCommentInput {
  @Field(() => ID)
  @IsUUID()
  id!: string;

  @Field(() => String)
  @IsNotEmpty()
  content!: string;
}

