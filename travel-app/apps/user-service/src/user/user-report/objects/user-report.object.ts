import {Field,ID,ObjectType,} from '@nestjs/graphql';
import { UserProfileObject } from '../../user-profile/objects/user-profile.object';

@ObjectType()
export class UserReportObject {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  reporter_id: string;

  @Field(() => ID)
  reported_user_id: string;

  @Field()
  reason: string;

  @Field()
  status: string;

  @Field(() => ID, {
    nullable: true,
  })
  handled_by?: string;

  @Field({
    nullable: true,
  })
  handled_at?: Date;

  @Field()
  created_at: Date;

  @Field(() => UserProfileObject, {
    nullable: true,
  })
  reporter?: UserProfileObject;

  @Field(() => UserProfileObject, {
    nullable: true,
  })
  reported_user?: UserProfileObject;
}