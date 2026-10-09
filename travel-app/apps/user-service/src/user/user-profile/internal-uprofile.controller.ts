import {  Body, Controller,  Get,  Param, Post,} from '@nestjs/common';
import { UserProfileService } from './user-profile.service';
import { GetProfilesByIdsBody } from './dto/internal-uprofiles.dto';

@Controller('internal/user-profiles')
export class InternalUProfileController {
  constructor(
    private readonly userProfileService: UserProfileService,
  ) {}

  @Get('account/:accountId')
  async getByAccountId(@Param('accountId') accountId: string) {
    return this.userProfileService.getInternalUProfileByAccountId(accountId);
  }


   @Post('comment-ids')
  async getByIds( @Body() body: GetProfilesByIdsBody) {
    return this.userProfileService.getInternalUProfilesByIds(
      body.profileIds,
    );
  }

}