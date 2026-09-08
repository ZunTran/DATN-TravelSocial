import {Args,ID,Int,Mutation,Query,Resolver} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { FollowService } from './follow.service';
import { JwtAuthGuard } from '../../common/auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/auth/decorators/current-user.decorator';
import type { ActiveUserData } from '../../common/auth/interfaces/user-data.interface';
import { FollowObject } from './objects/follow.object';
import { FollowPageObject } from './objects/follow-page.object';
import { PaginationInput } from '../../common/dto/pagination.input';

@Resolver()
export class FollowResolver {
  constructor(
    private readonly service: FollowService,
  ) {}

  @Mutation(() => FollowObject)
  @UseGuards(JwtAuthGuard)
  follow(@CurrentUser() user: ActiveUserData,
    @Args('profileId', { type: () => ID }) profileId: string) {
    return this.service.follow(user.accountId,profileId);
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  unfollow(@CurrentUser() user: ActiveUserData,
    @Args('profileId', { type: () => ID }) profileId: string) {
    return this.service.unfollow(user.accountId,profileId);
  }

  @Query(() => Boolean)
  @UseGuards(JwtAuthGuard)
  isFollowing(@CurrentUser() user: ActiveUserData,
    @Args('profileId', { type: () => ID }) profileId: string) {
    return this.service.isFollowing(user.accountId,profileId);
  }


  @Query(() => FollowPageObject)
@UseGuards(JwtAuthGuard)
followers(
  @Args('profileId', {
    type: () => ID,
  })
  profileId: string,

  @Args('input')
  input: PaginationInput,
) {
  return this.service.getFollowers(
    profileId,
    input.page,
    input.limit,
  );
}

@Query(() => FollowPageObject)
@UseGuards(JwtAuthGuard)
following(
  @Args('profileId', {
    type: () => ID,
  })
  profileId: string,

  @Args('input')
  input: PaginationInput,
) {
  return this.service.getFollowing(
    profileId,
    input.page,
    input.limit,
  );
}


  @Query(() => Int)
  @UseGuards(JwtAuthGuard)
  followersCount(@Args('profileId', { type: () => ID }) profileId: string) {
  return this.service.countFollowers(profileId);
}

  @Query(() => Int)
  @UseGuards(JwtAuthGuard)
  followingCount(@Args('profileId', { type: () => ID }) profileId: string) {
  return this.service.countFollowing(profileId);
}

}