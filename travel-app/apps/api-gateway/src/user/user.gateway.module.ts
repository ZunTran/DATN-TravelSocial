import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { UserGatewayResolver } from './user.gateway.resolver';
import { UserGatewayService } from './user.gateway.service';

@Module({
  imports: [
    HttpModule,
  ],

  providers: [
    UserGatewayResolver,
    UserGatewayService,
  ],

  exports: [
    UserGatewayService,
  ],
})
export class UserGatewayModule {}
