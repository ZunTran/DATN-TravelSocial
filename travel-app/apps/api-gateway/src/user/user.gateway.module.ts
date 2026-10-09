import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { UserGraphqlClient } from './clients/user-graphql-client';
import { UserFollowService } from './user-follow/user-follow.service';
import { UserInterestService } from './user-interest/user-interest.service';
import { UserProfileService } from './user-profile/user-profile.service';
import { UserFollowResolver } from './user-follow/user-follow.resolver';
import { UserInterestResolver } from './user-interest/user-interest.resolver';
import { UserProfileResolver } from './user-profile/user-profile.resolver';
import { NotificationResolver } from './user-notification/user-notification.resolver';
import { NotificationService } from './user-notification/user-notification.service';
import { UserReportModule } from './user-report/user-report.module';

@Module({
  imports: [
    HttpModule,
    UserReportModule
  ],

  providers: [
    UserGraphqlClient,

    NotificationService,
    UserProfileService,
    UserInterestService,
    UserFollowService,

    NotificationResolver,
    UserProfileResolver,
    UserInterestResolver,
    UserFollowResolver,
    
  ],

  exports: [
    UserProfileService,
    UserInterestService,
    UserFollowService,
    UserGraphqlClient
  ],
})
export class UserGatewayModule {}
