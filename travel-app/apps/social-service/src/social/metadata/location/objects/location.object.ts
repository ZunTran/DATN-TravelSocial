import { Field, Float, ID, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class LocationObject {
  @Field(() => ID)
  id!: string;

  @Field()
  name!: string;

  @Field(() => String, { nullable: true })
  address?: string | null;

  @Field(() => Float, { nullable: true })
  latitude?: number | null;

  @Field(() => Float, { nullable: true })
  longitude?: number | null;

  @Field(() => String, { nullable: true })
  province?: string | null;
}

@ObjectType()
export class LocationPageInfo {
  @Field(() => String, { nullable: true })
  nextCursor?: string | null;

  @Field()
  hasNextPage!: boolean;
}


@ObjectType()
export class AdminLocationPage {
  @Field(() => [LocationObject])
  items!: LocationObject[];

  @Field(() => Int)
  page!: number;

  @Field(() => Int)
  limit!: number;

  @Field(() => Int)
  total!: number;

  @Field(() => Int)
  totalPages!: number;
}