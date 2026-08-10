import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { PaginationInput } from '../../../common/dto/pagination.input';

@InputType()
export class SearchUserInput extends PaginationInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  keyword?: string;
  
}