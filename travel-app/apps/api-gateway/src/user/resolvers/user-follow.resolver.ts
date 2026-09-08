import { Args, Context, Mutation, Query, Resolver,ID,Int} from '@nestjs/graphql';
import { UserFollowService } from '../services/user-follow.service';
import { GatewayFollow } from '../types/follow.type';
import { GatewayFollowPage} from '../../social/interaction/types/interaction.types';
import { GatewayPaginationInput} from '../../social/interaction/dto/interaction.inputs';
import { getAuthorization } from '../common/auth/gateway-auth.util';

@Resolver()
export class UserFollowResolver {
  constructor(
    private readonly userFollowService: UserFollowService,
  ) {}

  @Mutation(() => GatewayFollow)
  follow(
    @Args('profileId', {
      type: () => ID,
    })
    profileId: string,

    @Context() context: any,
  ) {
    return this.userFollowService.follow(
      profileId,
      getAuthorization(context),
    );
  }

  @Mutation(() => Boolean)
  unfollow(
    @Args('profileId', {
      type: () => ID,
    })
    profileId: string,

    @Context() context: any,
  ) {
    return this.userFollowService.unfollow(
      profileId,
      getAuthorization(context),
    );
  }

  @Query(() => Boolean)
  isFollowing(
    @Args('profileId', {
      type: () => ID,
    })
    profileId: string,

    @Context() context: any,
  ) {
    return this.userFollowService.isFollowing(
      profileId,
      getAuthorization(context),
    );
  }

  @Query(() => Boolean)
  isBlocked(
    @Args('profileId', {
      type: () => ID,
    })
    profileId: string,

    @Context() context: any,
  ) {
    return this.userFollowService.isBlocked(
      profileId,
      getAuthorization(context),
    );
  }

  @Mutation(() => Boolean)
  unblock(
    @Args('profileId', {
      type: () => ID,
    })
    profileId: string,

    @Context() context: any,
  ) {
    return this.userFollowService.unblock(
      profileId,
      getAuthorization(context),
    );
  }

  @Query(() => Int)
  followersCount(
    @Args('profileId', {
      type: () => ID,
    })
    profileId: string,

    @Context() context: any,
  ) {
    return this.userFollowService.followersCount(
      profileId,
      getAuthorization(context),
    );
  }

  @Query(() => Int)
  followingCount(
    @Args('profileId', {
      type: () => ID,
    })
    profileId: string,

    @Context() context: any,
  ) {
    return this.userFollowService.followingCount(
      profileId,
      getAuthorization(context),
    );
  }

  @Query(() => GatewayFollowPage)
  followers(
    @Args('profileId', {
      type: () => ID,
    })
    profileId: string,

    @Args('input')
    input: GatewayPaginationInput,

    @Context() context: any,
  ) {
    return this.userFollowService.followers(
      profileId,
      input,
      getAuthorization(context),
    );
  }

  @Query(() => GatewayFollowPage)
  following(
    @Args('profileId', {
      type: () => ID,
    })
    profileId: string,

    @Args('input') input: GatewayPaginationInput,

    @Context() context: any,
  ) {
    return this.userFollowService.following(
      profileId,
      input,
      getAuthorization(context),
    );
  }
}