import { Field, Float, ID, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateLocationInput {
  @Field(() => ID)
  id!: string;

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