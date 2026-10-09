import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { SocialLocationClient } from './social-location.client';

@Module({
  imports: [
    HttpModule,
  ],
  providers: [
    SocialLocationClient,
  ],
  exports: [
    SocialLocationClient,
  ],
})
export class SocialModule {}