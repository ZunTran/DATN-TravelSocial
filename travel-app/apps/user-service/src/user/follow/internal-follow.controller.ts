import { Controller, Get, Param } from '@nestjs/common';
import { FollowService } from './follow.service';

@Controller('internal/follows')
export class InternalFollowController {
  constructor(
    private readonly followService: FollowService,
  ) {}

  @Get(':accountId/following-ids')
  async getFollowingProfileIds(
    @Param('accountId') accountId: string,
  ) {
    const followingProfileIds =await this.followService.getFollowingProfileIds(
        accountId,
      );

    return {
      accountId,
      followingProfileIds,
    };
  }
}