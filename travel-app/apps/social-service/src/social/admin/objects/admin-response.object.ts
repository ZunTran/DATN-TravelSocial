import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AdminResponseObject {
  @Field()
  message: string;

  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  username?: string;
}