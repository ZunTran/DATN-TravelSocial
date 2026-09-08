import { Module } from '@nestjs/common';

import { UserProfileResolver } from './user-profile.resolver';
import { UserProfileService } from './user-profile.service';
import { UserProfileRepository } from './user-profile.repository';
import { InternalUProfileController } from './internal-uprofile.controller';
import { UserRegisteredConsumer } from '../../common/events/user-registered.consumer';

@Module({
  controllers:[InternalUProfileController  ],

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