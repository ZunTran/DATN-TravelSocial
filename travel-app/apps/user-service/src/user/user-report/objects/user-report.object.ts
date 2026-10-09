import {Field,GraphQLISODateTime,ID,ObjectType,} from '@nestjs/graphql';
import { UserProfileObject } from '../../user-profile/objects/user-profile.object';
import { user_report_status } from '@prisma/client';

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

  @Field(() => user_report_status)
  status: user_report_status;

  @Field(() => ID, {
    nullable: true,
  })
  handled_by?: string;

  @Field(() => GraphQLISODateTime, {
    nullable: true,
  })
  handled_at?: Date | null;

  @Field(() => GraphQLISODateTime)
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