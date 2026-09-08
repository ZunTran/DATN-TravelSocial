import {Args,Mutation,Query,Resolver} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { UserProfileObject } from './objects/user-profile.object';
import { UserProfileService } from './user-profile.service';
import { CreateProfileInput } from './dto/create-profile.input';
import { UpdateProfileInput } from './dto/update-profile.input';
import { CurrentUser } from '../../common/auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/auth/guards/jwt-auth.guard';
import { SearchUserInput } from './dto/search-user.input';
import { GraphQLUpload} from 'graphql-upload-ts';
import type { FileUpload } from 'graphql-upload-ts';
import { UserProfilePageObject } from './objects/user-profile-page.object';
import type { ActiveUserData } from '../../common/auth/interfaces/user-data.interface';
import { user_privacy } from '@prisma/client';

@Resolver(() => UserProfileObject)
export class UserProfileResolver {
  constructor(
    private readonly service: UserProfileService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Mutation(() => UserProfileObject)
  createProfile(
    @CurrentUser() user: ActiveUserData,
    @Args('input') input: CreateProfileInput) {
    return this.service.createProfile(
      user.accountId,
      input
    );
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => UserProfileObject)
  myProfile(@CurrentUser() user: ActiveUserData) {
    return this.service.getMyProfile(user.accountId);
  }

  @Query(() => UserProfileObject)
  userProfile(@Args('id') id: string) {
    return this.service.getUserProfile(id);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => UserProfileObject)
  updateProfile(
    @CurrentUser() user: ActiveUserData,
    @Args('input') input: UpdateProfileInput,) {
    return this.service.updateProfile(user.accountId,input);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => UserProfileObject)
  updatePrivacy(
    @CurrentUser() user: ActiveUserData,
    @Args('privacy', { type: () => user_privacy })
  privacy: user_privacy) {
    return this.service.updatePrivacy(
      user.accountId,
      privacy,
    );
  }

  @Query(() => Boolean)
  checkUsername(@Args('username') username: string) {
    return this.service.checkUsername(username);
  }

 @Query(() => UserProfilePageObject) 
@UseGuards(JwtAuthGuard)
async searchUsers(@Args('input') input: SearchUserInput) {
  return this.service.searchUsers(input);
}

@UseGuards(JwtAuthGuard)
  @Mutation(() => UserProfileObject)
  async updateProfileWithFiles(
    @CurrentUser() user: ActiveUserData,
    @Args('input') input: UpdateProfileInput,
    @Args({ name: 'avatar', type: () => GraphQLUpload, nullable: true }) avatar?: FileUpload,
    @Args({ name: 'cover', type: () => GraphQLUpload, nullable: true }) cover?: FileUpload,
  ) {
    return this.service.updateProfileWithFiles(user.accountId, input, avatar, cover);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => UserProfileObject)
  async updateAvatar(
    @CurrentUser() user: ActiveUserData,
    @Args({ name: 'avatar', type: () => GraphQLUpload})
    avatar: FileUpload,
  ) {
    return this.service.updateAvatar( user.accountId, avatar);
  }

  @Query(() => UserProfileObject, { nullable: true })
  profileByUsername(@Args('username') username: string) {
    return this.service.getProfileByUsername(username);
  }


}