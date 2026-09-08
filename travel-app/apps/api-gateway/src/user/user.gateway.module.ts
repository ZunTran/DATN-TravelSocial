import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { UserGraphqlClient } from './clients/user-graphql-client';
import { UserFollowService } from './services/user-follow.service';
import { UserInterestService } from './services/user-interest.service';
import { UserProfileService } from './services/user-profile.service';
import { UserFollowResolver } from './resolvers/user-follow.resolver';
import { UserInterestResolver } from './resolvers/user-interest.resolver';
import { UserProfileResolver } from './resolvers/user-profile.resolver';

@Module({
  imports: [
    HttpModule,
  ],

  providers: [
    UserGraphqlClient,

    UserProfileService,
    UserInterestService,
    UserFollowService,

     UserProfileResolver,
    UserInterestResolver,
    UserFollowResolver,
  ],

  exports: [
     UserProfileService,
    UserInterestService,
    UserFollowService,
  ],
})
export class UserGatewayModule {}
