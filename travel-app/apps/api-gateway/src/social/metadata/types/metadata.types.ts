import {
  Field,
  Float,
  ID,
  ObjectType,
} from '@nestjs/graphql';

@ObjectType()
export class CategoryObject {
  @Field(() => ID)
  id!: string;

  @Field()
  name!: string;

  @Field(() => String, {
    nullable: true,
  })
  description?: string | null;
}

@ObjectType()
export class LocationObject {
  @Field(() => ID)
  id!: string;

  @Field()
  name!: string;

  @Field(() => String, {
    nullable: true,
  })
  address?: string | null;

  @Field(() => Float, {
    nullable: true,
  })
  latitude?: number | null;

  @Field(() => Float, {
    nullable: true,
  })
  longitude?: number | null;

  @Field(() => String, {
    nullable: true,
  })
  province?: string | null;
}

@ObjectType()
export class HashtagObject {
  @Field(() => ID)
  id!: string;

  @Field()
  name!: string;
}