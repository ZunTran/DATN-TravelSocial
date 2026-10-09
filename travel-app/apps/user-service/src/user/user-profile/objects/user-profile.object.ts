import { Field, GraphQLISODateTime, ID, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import {
  gender_type,
  user_privacy
} from '@prisma/client';

registerEnumType(gender_type, {
  name: 'GenderType', 
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
  location?: string;

  @Field(() => user_privacy)
  privacy: user_privacy;

  @Field()
  isCompleted: boolean;

  @Field(() => GraphQLISODateTime, { nullable: true })
  birthday?: Date | null;

  @Field(() => GraphQLISODateTime)
  created_at: Date;

  @Field(() => GraphQLISODateTime)
  updated_at: Date;

  @Field(() => Int, { nullable: true }) 
  commonInterestsCount?: number;
}