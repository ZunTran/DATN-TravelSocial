import { Field, InputType, Int} from '@nestjs/graphql';

@InputType()
export class GatewaySearchUserInput {
  @Field({ nullable: true })
  keyword?: string;

  @Field(() => Int, { defaultValue: 1 })
  page: number = 1;

  @Field(() => Int, { defaultValue: 20})
  limit: number = 20;
}