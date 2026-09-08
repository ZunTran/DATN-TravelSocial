import {
  Field,
  Int,
  InputType,
} from '@nestjs/graphql';

@InputType()
export class GetInterestsInput {
  @Field(() => Int, {
    defaultValue: 1,
  })
  page: number;

  @Field(() => Int, {
    defaultValue: 20,
  })
  limit: number;

  @Field({
    nullable: true,
  })
  search?: string;
}