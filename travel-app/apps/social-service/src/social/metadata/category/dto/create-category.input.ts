import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, MaxLength } from 'class-validator';

@InputType()
export class CreateCategoryInput {
  @Field()
  @IsNotEmpty()
  @MaxLength(100)
  name!: string;

  @Field({ nullable: true })
  @MaxLength(500)
  description?: string;
}
