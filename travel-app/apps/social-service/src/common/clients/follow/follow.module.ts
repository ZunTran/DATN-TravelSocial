import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { FollowClient } from './follow.client';

@Module({
  imports: [
    HttpModule,
  ],
  providers: [
    FollowClient,
  ],
  exports: [
    FollowClient,
  ],
})
export class FollowClientModule {}