import { Field, Float, InputType } from '@nestjs/graphql';

@InputType()
export class CreateLocationInput {
  @Field()
  name!: string;

  @Field({ nullable: true })
  address?: string;

  @Field(() => Float, { nullable: true })
  latitude?: number;

  @Field(() => Float, { nullable: true })
  longitude?: number;

  @Field({ nullable: true })
  province?: string;
}