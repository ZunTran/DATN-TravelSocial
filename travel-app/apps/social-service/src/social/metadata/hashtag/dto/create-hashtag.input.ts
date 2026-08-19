import { Field, InputType } from '@nestjs/graphql';
import {  IsNotEmpty,  MaxLength,} from 'class-validator';

@InputType()
export class CreateHashtagInput {
  @Field()
  @IsNotEmpty()
  @MaxLength(100)
  name!: string;
}
