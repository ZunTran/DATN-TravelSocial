import {
  Field,
  ID,
  InputType,
} from '@nestjs/graphql';

import {
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

@InputType()
export class PostFilterInput {
  @Field(() => ID, {
    nullable: true,
  })
  @IsOptional()
  @IsUUID()
  authorId?: string;

  @Field(() => ID, {
    nullable: true,
  })
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @Field(() => ID, {
    nullable: true,
  })
  @IsOptional()
  @IsUUID()
  locationId?: string;

  // THÊM CÁI NÀY
  @Field(() => String, {
    nullable: true,
  })
  @IsOptional()
  @IsString()
  keyword?: string;
}