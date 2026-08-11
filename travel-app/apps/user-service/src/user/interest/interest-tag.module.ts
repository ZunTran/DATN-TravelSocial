import { Module } from '@nestjs/common';

import { InterestTagResolver } from './interest-tag.resolver';
import { InterestTagService } from './interest-tag.service';
import { InterestTagRepository } from './interest-tag.repository';
import { PrismaModule } from '../../prisma/prisma.module';
import { UserProfileModule } from '../user-profile/user-profile.module';

@Module({
  imports: [
    PrismaModule,
    UserProfileModule, 
  ],
  providers: [
    InterestTagResolver,
    InterestTagService,
    InterestTagRepository,
  ],
  exports: [
    InterestTagService,
    InterestTagRepository,
  ],
})
export class InterestTagModule {}