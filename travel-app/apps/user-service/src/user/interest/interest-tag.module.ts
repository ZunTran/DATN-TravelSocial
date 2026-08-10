import { Module } from '@nestjs/common';

import { InterestTagResolver } from './interest-tag.resolver';
import { InterestTagService } from './interest-tag.service';
import { InterestTagRepository } from './interest-tag.repository';

@Module({
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