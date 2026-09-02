import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { SocialGatewayResolver } from '../social/social.gateway.resolver';
import { SocialGatewayService } from './social.gateway.service';

@Module({
  imports: [
    HttpModule,
  ],
  providers: [
    SocialGatewayResolver,
    SocialGatewayService,
  ],
})
export class SocialModule {}