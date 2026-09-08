import {
  Field,
  ID,
  ObjectType,
  Int,
  InputType
} from '@nestjs/graphql';

@InputType()
export class GatewayInterestPaginationInput {
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