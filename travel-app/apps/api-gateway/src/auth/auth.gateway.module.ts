import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AuthGatewayResolver } from './auth.gateway.resolver';
import { AuthGatewayService } from './auth.gateway.service';
import { UserGraphqlClient } from '../user/clients/user-graphql-client';

@Module({
  imports: [
    HttpModule,
  ],

  providers: [
    AuthGatewayResolver,
    AuthGatewayService,
    UserGraphqlClient

  ],

  exports: [
    AuthGatewayService,
  ],
})
export class AuthGatewayModule {}