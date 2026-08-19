import {  Field,  ID,  InputType,} from '@nestjs/graphql';
import {  IsNotEmpty,  IsUUID,  MaxLength,} from 'class-validator';

@InputType()
export class UpdateHashtagInput {
  @Field(() => ID)
  @IsUUID()
  id!: string;

  @Field()
  @IsNotEmpty()
  @MaxLength(100)
  name!: string;
}
