import { forwardRef, Module } from '@nestjs/common';

import { UserProfileResolver } from './user-profile.resolver';
import { UserProfileService } from './user-profile.service';
import { UserProfileRepository } from './user-profile.repository';
import { InternalUProfileController } from './internal-uprofile.controller';
import { UserRegisteredConsumer } from '../../common/events/user-registered.consumer';
import { PrismaModule } from '../../prisma/prisma.module';
import { FollowModule } from '../follow/follow.module';

@Module({
  controllers:[InternalUProfileController  ],

  imports: [
      PrismaModule,
      forwardRef(() => FollowModule)

    ],
  providers: [
    UserProfileResolver,
    UserProfileService,
    UserProfileRepository,
    UserRegisteredConsumer
    
  ],
  exports: [
    UserProfileService,
    UserProfileRepository,
  ],
})
export class UserProfileModule {}