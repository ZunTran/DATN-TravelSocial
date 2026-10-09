import {
  Field,
  ID,
  ObjectType,
} from '@nestjs/graphql';

import { GraphQLISODateTime } from '@nestjs/graphql';
import { UserReportStatus } from './user-report-status.enum';
import { GatewayUserProfile } from '../../user-profile/types/profile.type';

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

  @Field(() => UserReportStatus)
  status: UserReportStatus;

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

  @Field(() => GatewayUserProfile, {
    nullable: true,
  })
  reporter?: GatewayUserProfile;

  @Field(() => GatewayUserProfile, {
    nullable: true,
  })
  reported_user?: GatewayUserProfile;
}