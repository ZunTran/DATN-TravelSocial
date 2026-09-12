import {
  Field,
  InputType,
  Int,
  ObjectType,
} from '@nestjs/graphql';

@ObjectType()
export class AdminAccountGatewayObject {
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
export class AdminAccountPageGatewayObject {
  @Field(() => [AdminAccountGatewayObject])
  items!: AdminAccountGatewayObject[];

  @Field(() => Int)
  total!: number;

  @Field(() => Int)
  page!: number;

  @Field(() => Int)
  limit!: number;

  @Field(() => Int)
  totalPages!: number;
}

@InputType()
export class AdminAccountFilterGatewayInput {
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