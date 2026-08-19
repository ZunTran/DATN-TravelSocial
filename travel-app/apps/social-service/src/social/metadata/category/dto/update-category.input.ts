import { Field, ID, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsUUID, MaxLength } from 'class-validator';

@InputType()
export class UpdateCategoryInput {
  @Field(() => ID)
  @IsUUID()
  id!: string;

  @Field()
  @IsNotEmpty()
  @MaxLength(100)
  name!: string;

  @Field({ nullable: true })
  @MaxLength(500)
  description?: string;
}
