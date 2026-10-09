import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { SocialGatewayResolver } from './social.gateway.resolver';
import { SocialGatewayService } from './social.gateway.service';
import { LocationGatewayService } from './metadata/location/location.gateway.service';
import { HashtagGatewayService } from './metadata/hashtag/hashtag.gateway.service';
import { ShareGatewayService } from './interaction/share.gateway.service';
import { SaveGatewayService } from './interaction/save.gateway.service';
import { LikeGatewayService } from './interaction/like.gateway.service';
import { FeedGatewayService } from './post/feed-gateway.service';
import { PostGatewayService } from './post/post-gateway.service';
import { SocialGraphqlClient } from './clients/social-graphql.client';
import { CategoryGatewayService } from './metadata/category/category.gateway.service';
import { CategoryGatewayResolver } from './metadata/category/category.gateway.resolver';
import { LocationGatewayResolver } from './metadata/location/location.gateway.resolver';
import { HashtagGatewayResolver } from './metadata/hashtag/hashtag.gateway.resolver';
import { CommentGatewayService } from './interaction/comment/comment.gateway.service';
import { CommentGatewayResolver } from './interaction/comment/comment.gateway.resolver';

@Module({
  imports: [
    HttpModule,
  ],
  providers: [
    SocialGatewayResolver,
    SocialGatewayService,
    SocialGraphqlClient,

    PostGatewayService,
    FeedGatewayService,

    LikeGatewayService,
    SaveGatewayService,
    ShareGatewayService,

    CategoryGatewayService,
    CategoryGatewayResolver,

    LocationGatewayResolver,
    LocationGatewayService,

    HashtagGatewayService,
    HashtagGatewayResolver,

    CommentGatewayResolver,
    CommentGatewayService,

  ],
})
export class SocialModule {}