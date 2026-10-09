import { Field, Float, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class LocationSearchResult {
  @Field()
  locationId: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  address?: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  category?: string;

  @Field({ nullable: true })
  province?: string;

  @Field(() => Float, { nullable: true })
  estimatedCost?: number;

  @Field(() => Int, { nullable: true })
  durationMinutes?: number;

  @Field({ nullable: true })
  openingHours?: string;

  @Field(() => Float)
  similarity: number;

  @Field(() => Float, { nullable: true })
  latitude?: number;

  @Field(() => Float, { nullable: true })
  longitude?: number;
}