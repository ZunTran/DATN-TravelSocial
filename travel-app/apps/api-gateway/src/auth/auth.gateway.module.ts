import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AuthGatewayResolver } from './auth.gateway.resolver';
import { AuthGatewayService } from './auth.gateway.service';

@Module({
  imports: [
    HttpModule,
  ],

  providers: [
    AuthGatewayResolver,
    AuthGatewayService,
  ],

  exports: [
    AuthGatewayService,
  ],
})
export class AuthGatewayModule {}