import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { AdminGatewayResolver } from './admin-gateway.resolver';
import { AdminGatewayService } from './admin-gateway.service';
import { UserGraphqlClient } from '../user/clients/user-graphql-client';

@Module({
  imports: [
    HttpModule,
  ],

  providers: [
    AdminGatewayResolver,
    AdminGatewayService,
    UserGraphqlClient
    
  ],

  exports: [
    AdminGatewayService,
  ],
})
export class AdminModule {}