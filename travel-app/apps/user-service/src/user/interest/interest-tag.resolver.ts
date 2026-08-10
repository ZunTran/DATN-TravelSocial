import {Args,ID,Mutation,Query,Resolver,} from '@nestjs/graphql';
import {UseGuards,BadRequestException,} from '@nestjs/common';
import { InterestTagService } from './interest-tag.service';

import { Roles } from '../../common/auth/decorators/roles.decorator';
import { account_role } from '@prisma/client';
import { InterestTagObject } from './objects/interest.object';
import { JwtAuthGuard } from '../../common/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/auth/guards/roles.guard';
import { CreateInterestInput, UpdateInterestInput } from './dto/create-interest.input.ts';
import { CurrentUser } from '../../common/auth/decorators/current-user.decorator';
import type { ActiveUserData } from '../../common/auth/interfaces/user-data.interface';
import { UserInterestPageObject } from './objects/user-interest-page.object';
import { GetUserInterestsInput } from './dto/get-user-interests.input';

@Resolver(() => InterestTagObject)
export class InterestTagResolver {
  constructor(
    private readonly service: InterestTagService,
  ) {}

   @Query(() => [InterestTagObject])getInterestTags() {
    return this.service.getAllTags();
  }

  @Query(() => [InterestTagObject])
  searchInterestTags(@Args('name') name: string,) {
    return this.service.search(name);
  }


  @Mutation(() => InterestTagObject)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(account_role.ADMIN)
  createInterestTag(@Args('input') input: CreateInterestInput) {
    return this.service.createTag(input);
  }

  @Mutation(() => InterestTagObject)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(account_role.ADMIN)
  updateInterestTag(@Args('id', { type: () => ID }) id: string,@Args('input') input: UpdateInterestInput,) {
    return this.service.updateTag(id, input);
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(account_role.ADMIN)
  async deleteInterestTag(@Args('id', { type: () => ID }) id: string,) {
    await this.service.deleteTag(id);
    return true;
  }

  @Query(() => [InterestTagObject])
  @UseGuards(JwtAuthGuard)
  getMyInterests(@CurrentUser() user: ActiveUserData,) {
    return this.service.getUserInterests(user.accountId);
  }

  @Mutation(() => [InterestTagObject])
  @UseGuards(JwtAuthGuard)
  updateMyInterests(@CurrentUser() user: ActiveUserData,@Args('interestIds',
   { type: () => [ID] })interestIds: string[],) {
    return this.service.updateUserInterests(
      user.accountId,
      interestIds,
    );
  }


  
  @Query(() => UserInterestPageObject)
  @UseGuards(JwtAuthGuard)
  getMyInterestsPaginated(
    @CurrentUser() user: ActiveUserData,
    @Args('input') input: GetUserInterestsInput,
  ) {
    return this.service.getUserInterestsPaginated(user.accountId, input);
  }

  // Gợi ý những user khác có chung sở thích du lịch
  @Query(() => [InterestTagObject]) // Hoặc trả về danh sách User Profile tùy theo thiết kế hiển thị
  @UseGuards(JwtAuthGuard)
  getSuggestedUsersByInterests(@CurrentUser() user: ActiveUserData) {
    return this.service.getSuggestedUsersByInterests(user.accountId);
  }


}