import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import {
  gender_type,
  user_privacy
} from '@prisma/client';

registerEnumType(gender_type, {
  name: 'GenderType', // Tên sẽ hiển thị trên GraphQL Schema
});

registerEnumType(user_privacy, {
  name: 'UserPrivacy',
});

@ObjectType()
export class UserProfileObject {
  @Field(() => ID)
  id: string;


  @Field()
  username: string;

  @Field()
  display_name: string;

  @Field({ nullable: true })
  avatar_url?: string;

  @Field({ nullable: true })
  cover_url?: string;

  @Field({ nullable: true })
  bio?: string;

  @Field(() => gender_type, { nullable: true })
  gender?: gender_type;

  @Field({ nullable: true })
  birthday?: Date;

  @Field({ nullable: true })
  location?: string;

  @Field(() => user_privacy)
  privacy: user_privacy;

  @Field()
  isCompleted: boolean;

  @Field()
  created_at: Date;

  @Field()
  updated_at: Date;
}