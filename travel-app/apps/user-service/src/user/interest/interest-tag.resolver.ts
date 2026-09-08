import {Args,ID,Mutation,Query,Resolver} from '@nestjs/graphql';
import {UseGuards} from '@nestjs/common';
import { InterestTagService } from './interest-tag.service';

import { Roles } from '../../common/auth/decorators/roles.decorator';
import { InterestTagObject } from './objects/interest.object';
import { JwtAuthGuard } from '../../common/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/auth/guards/roles.guard';
import { CreateInterestInput, UpdateInterestInput } from './dto/create-interest.input';
import { CurrentUser } from '../../common/auth/decorators/current-user.decorator';
import type { ActiveUserData } from '../../common/auth/interfaces/user-data.interface';
import { UserInterestPageObject } from './objects/user-interest-page.object';
import { GetUserInterestsInput } from './dto/get-user-interests.input';
import { UserProfileObject } from '../user-profile/objects/user-profile.object';
import { account_role } from '@prisma/client';
import { InterestPageObject } from './objects/interest-page.object';
import { GetInterestsInput } from './dto/get-interests.input';
import {  GraphQLUpload } from 'graphql-upload-ts';
import type { FileUpload } from 'graphql-upload-ts';

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
createInterestTag(
  @Args('input', {
    type: () => CreateInterestInput,
  })
  input: CreateInterestInput,
  @Args('icon', {
    type: () => GraphQLUpload,
    nullable: true,
  })
  icon?: FileUpload,
) {
  console.log('========== USER RESOLVER ==========');
  console.log('INPUT:', input);
  console.log('INPUT NAME:', input?.name);
  console.log('ICON:', icon?.filename);
  console.log('===================================');

  return this.service.createTag(input, icon);
}

  @Mutation(() => InterestTagObject)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(account_role.ADMIN)
  updateInterestTag(@Args('id', { type: () => ID }) id: string, @Args('input', { type: () => UpdateInterestInput })
  input: UpdateInterestInput,
    @Args('icon', {type: () => GraphQLUpload, nullable: true }) icon?: FileUpload) {
    return this.service.updateTag(id, input, icon);
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


@Query(() => [InterestTagObject])
getUserInterests(
  @Args('profileId', { type: () => ID }) profileId: string,
) {
  return this.service.getUserInterestsByProfileId(profileId);
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
  @Query(() => [UserProfileObject]) 
  @UseGuards(JwtAuthGuard)
  getSuggestedUsersByInterests(@CurrentUser() user: ActiveUserData) {
    return this.service.getSuggestedUsersByInterests(user.accountId);
  }

  @Query(() => InterestPageObject)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(account_role.ADMIN)
  getInterestTagsPaginated(
    @Args('input') input: GetInterestsInput) {
    return this.service.getAllTagsPaginated(
      input.page,
      input.limit,
      input.search,
    );
  }

}