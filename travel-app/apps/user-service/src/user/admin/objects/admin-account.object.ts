import {
  Field,
  InputType,
  Int,
  ObjectType,
} from '@nestjs/graphql';

@InputType()
export class AdminAccountFilterInput {
  @Field(() => String, {
    nullable: true,
  })
  search?: string;

  @Field(() => Int, {
    nullable: true,
    defaultValue: 1,
  })
  page?: number;

  @Field(() => Int, {
    nullable: true,
    defaultValue: 10,
  })
  limit?: number;
}

@ObjectType()
export class AdminAccountObject {
  @Field(() => String)
  id!: string;

  @Field(() => String)
  email!: string;

  @Field(() => String, {
    nullable: true,
  })
  username!: string | null;

  @Field(() => String, {
    nullable: true,
  })
  displayName!: string | null;

  @Field(() => String)
  status!: string;

  @Field(() => Date, {
    nullable: true,
  })
  lastLoginAt!: Date | null;

  @Field(() => Date)
  createdAt!: Date;
}

@ObjectType()
export class AdminAccountPageObject {
  @Field(() => [AdminAccountObject])
  items!: AdminAccountObject[];

  @Field(() => Int)
  total!: number;

  @Field(() => Int)
  page!: number;

  @Field(() => Int)
  limit!: number;

  @Field(() => Int)
  totalPages!: number;
}