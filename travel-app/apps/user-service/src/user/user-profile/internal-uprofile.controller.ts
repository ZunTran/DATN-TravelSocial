import {  Controller,  Get,  Param,} from '@nestjs/common';
import { UserProfileService } from './user-profile.service';

@Controller('internal/user-profiles')
export class InternalUProfileController {
  constructor(
    private readonly userProfileService: UserProfileService,
  ) {}

  @Get('account/:accountId')
  async getByAccountId(@Param('accountId') accountId: string) {
    return this.userProfileService.getInternalUProfileByAccountId(accountId);
  }

    @Get('account/:accountId')
  async getFollowingByAccountId(@Param('accountId') accountId: string) {
    return this.userProfileService.getInternalUProfileByAccountId(accountId);
  }

}