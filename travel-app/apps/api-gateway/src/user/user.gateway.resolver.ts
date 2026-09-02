import {
  Args,
  Context,
  ID,
  Field,
  ObjectType,
  Query,
  Mutation,
  Resolver,
  InputType,
} from '@nestjs/graphql';

import { UserGatewayService } from './user.gateway.service';
import { Int } from '@nestjs/graphql/dist/tests/lib/index.js';

// ============================================================
// USER PROFILE
// ============================================================

@ObjectType()
export class GatewayUserProfile {
  @Field(() => ID)
  id: string;

  @Field()
  username: string;

  @Field()
  display_name: string;

  @Field({ nullable: true })
  avatar_url?: string;

  @Field({ nullable: true })
  cover_url?: string;

  @Field({ nullable: true })
  bio?: string;

  @Field({ nullable: true })
  gender?: string;

  @Field({ nullable: true })
  birthday?: string;

  @Field({ nullable: true })
  location?: string;

  @Field()
  privacy: string;

  @Field()
  created_at: string;

  @Field()
  updated_at: string;
}

// ============================================================
// INTEREST TAG
// ============================================================

@ObjectType()
export class GatewayInterestTag {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  icon_url?: string;

  @Field()
  created_at: string;
}

// ============================================================
// FOLLOW
// ============================================================

@ObjectType()
export class GatewayFollow {
  @Field(() => ID)
  follower_id: string;

  @Field(() => ID)
  following_id: string;

  @Field()
  created_at: string;
}

// ============================================================
// UPDATE PROFILE INPUT
// ============================================================

@InputType()
export class GatewayUpdateProfileInput {
  @Field({ nullable: true })
  username?: string;

  @Field({ nullable: true })
  display_name?: string;

  @Field({ nullable: true })
  avatar_url?: string;

  @Field({ nullable: true })
  cover_url?: string;

  @Field({ nullable: true })
  bio?: string;

  @Field({ nullable: true })
  gender?: string;

  @Field({ nullable: true })
  birthday?: string;

  @Field({ nullable: true })
  location?: string;

  @Field({ nullable: true })
  privacy?: string;
}

// ============================================================
// RESOLVER
// ============================================================

@Resolver()
export class UserGatewayResolver {
  constructor(
    private readonly userGatewayService: UserGatewayService,
  ) {}

  // ==========================================================
  // AUTH
  // ==========================================================

  private getAuthorization(
    context: any,
  ): string | undefined {
    const authorization =
      context.req?.headers?.authorization;

    if (authorization) {
      return authorization;
    }

    const token =
      context.req?.cookies?.accessToken;

    if (token) {
      return `Bearer ${token}`;
    }

    return undefined;
  }

  // ==========================================================
  // PROFILE
  // ==========================================================

  @Query(() => GatewayUserProfile)
  myProfile(
    @Context() context: any,
  ) {
    return this.userGatewayService.myProfile(
      this.getAuthorization(context),
    );
  }

  @Query(() => GatewayUserProfile)
  userProfile(
    @Args('id') id: string,
  ) {
    return this.userGatewayService.userProfile(id);
  }

  @Query(() => Boolean)
  checkUsername(
    @Args('username') username: string,
  ) {
    return this.userGatewayService.checkUsername(
      username,
    );
  }

  // ==========================================================
  // INTEREST TAGS
  // ==========================================================

  @Query(() => [GatewayInterestTag])
  getInterestTags() {
    return this.userGatewayService.getInterestTags();
  }

  @Query(() => [GatewayInterestTag])
  getMyInterests(
    @Context() context: any,
  ) {
    return this.userGatewayService.getMyInterests(
      this.getAuthorization(context),
    );
  }

  @Query(() => [GatewayInterestTag])
  searchInterestTags(
    @Args('name', {
      type: () => String,
    })
    name: string,
  ) {
    return this.userGatewayService.searchInterestTags(
      name,
    );
  }

  @Mutation(() => [GatewayInterestTag])
  updateMyInterests(
    @Args('interestIds', {
      type: () => [ID],
    })
    interestIds: string[],

    @Context() context: any,
  ) {
    return this.userGatewayService.updateMyInterests(
      interestIds,
      this.getAuthorization(context),
    );
  }

  // ==========================================================
  // FOLLOW
  // ==========================================================

  @Mutation(() => GatewayFollow)
  follow(
    @Args('profileId', {
      type: () => ID,
    })
    profileId: string,

    @Context() context: any,
  ) {
    return this.userGatewayService.follow(
      profileId,
      this.getAuthorization(context),
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
    return this.userGatewayService.unfollow(
      profileId,
      this.getAuthorization(context),
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
    return this.userGatewayService.isFollowing(
      profileId,
      this.getAuthorization(context),
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
    return this.userGatewayService.isBlocked(
      profileId,
      this.getAuthorization(context),
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
    return this.userGatewayService.unblock(
      profileId,
      this.getAuthorization(context),
    );
  }

 @Mutation(() => GatewayUserProfile)
updateProfile(
  @Args('input')
  input: GatewayUpdateProfileInput,

  @Context()
  context: any,
) {
  return this.userGatewayService.updateProfile(
    input,
    this.getAuthorization(context),
  );
}

@Query(() => Int)
followersCount(
  @Args('profileId', { type: () => ID }) profileId: string,
  @Context() context: any,
) {
  return this.userGatewayService.followersCount(
    profileId,
    this.getAuthorization(context),
  );
}

@Query(() => Int)
followingCount(
  @Args('profileId', { type: () => ID }) profileId: string,
  @Context() context: any,
) {
  return this.userGatewayService.followingCount(
    profileId,
    this.getAuthorization(context),
  );
}

}