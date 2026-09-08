import { forwardRef, Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { FollowResolver } from './follow.resolver';
import { FollowService } from './follow.service';
import { FollowRepository } from './follow.repository';
import { UserProfileModule } from '../user-profile/user-profile.module';
import { BlockModule } from '../block/block.module';
import { NotificationModule } from '../notification/notification.module';
import { InternalFollowController } from './internal-follow.controller';

@Module({
  controllers: [
  InternalFollowController, 
],
  imports: [
    PrismaModule,
    UserProfileModule, 
    forwardRef(() => BlockModule),
    NotificationModule,
  ],
  providers: [
    FollowResolver,
    FollowService,
    FollowRepository,
  ],
  exports: [
    FollowService,
    FollowRepository,
  ],
})
export class FollowModule {}