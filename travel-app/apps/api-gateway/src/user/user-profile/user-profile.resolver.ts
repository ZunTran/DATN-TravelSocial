import {
  Args,
  Context,
  Mutation,
  Query,
  Resolver,
} from '@nestjs/graphql';

import {
  GraphQLUpload
} from 'graphql-upload-ts';

import type {
 FileUpload
} from 'graphql-upload-ts';

import { UserProfileService } from './user-profile.service';
import { GatewayUserProfile, GatewayUserProfilePageObject } from './types/profile.type';
import { GatewayUpdateProfileInput } from './dto/user-profile.input';
import { getAuthorization } from '../common/auth/gateway-auth.util';
import { GatewaySearchUserInput } from './dto/search-user.input';

@Resolver()
export class UserProfileResolver {
  constructor(
    private readonly userProfileService: UserProfileService,
  ) {}

  @Query(() => GatewayUserProfile)
  myProfile(
    @Context() context: any,
  ) {
    return this.userProfileService.myProfile(
      getAuthorization(context),
    );
  }

  @Query(() => GatewayUserProfile)
  userProfile(
    @Args('id') id: string,
  ) {
    return this.userProfileService.userProfile(id);
  }

  @Query(() => GatewayUserProfile, {
    nullable: true,
  })
  profileByUsername(
    @Args('username') username: string,
    @Context() context: any,
  ) {
    return this.userProfileService.profileByUsername(
      username,
      getAuthorization(context),
    );
  }

  @Query(() => Boolean)
  checkUsername(
    @Args('username') username: string,
  ) {
    return this.userProfileService.checkUsername(
      username,
    );
  }

  @Mutation(() => GatewayUserProfile)
  updateProfile(
    @Args('input') input: GatewayUpdateProfileInput,
   @Context() context: any) {
    return this.userProfileService.updateProfile(
      input,
      getAuthorization(context),
    );
  }

  @Mutation(() => GatewayUserProfile)
  updateAvatar(
    @Args({
      name: 'avatar',
      type: () => GraphQLUpload,
    })
    avatar: FileUpload,

    @Context() context: any) {
    return this.userProfileService.updateAvatar(
      avatar,
      getAuthorization(context),
    );
  }


  @Query(() => [GatewayUserProfile])
  getSuggestedUsersByInterests(@Context() context: any) {
    return this.userProfileService.getSuggestedUsersByInterests(
      getAuthorization(context),
    );
  }

  @Query(() => GatewayUserProfilePageObject)
async searchUsers(
  @Args('input') input: GatewaySearchUserInput,
  @Context() context: any,
) {
  return this.userProfileService.searchUsers(
    input,
    context.req?.headers?.authorization,
  );
}

}