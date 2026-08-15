import { forwardRef, Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { BlockResolver } from './block.resolver';
import { BlockService } from './block.service';
import { BlockRepository } from './block.repository';

import { FollowModule } from '../follow/follow.module';
import { UserProfileModule } from '../user-profile/user-profile.module';

@Module({
  imports: [
    PrismaModule,
    forwardRef(() => FollowModule),
    UserProfileModule
  ],
  providers: [
    BlockResolver,
    BlockService,
    BlockRepository
  ],
  exports: [
    BlockService,
    BlockRepository
  ],
})
export class BlockModule {}