import { Injectable } from '@nestjs/common';

import { UserGraphqlClient } from '../clients/user-graphql-client';

@Injectable()
export class UserFollowService {
  constructor(
    private readonly userGraphqlClient: UserGraphqlClient,
  ) {}

  async follow(
    profileId: string,
    authorization?: string,
  ) {
    const result =
      await this.userGraphqlClient.execute<{
        follow: any;
      }>(
        `
        mutation Follow(
          $profileId: ID!
        ) {
          follow(
            profileId: $profileId
          ) {
            follower_id
            following_id
            created_at
          }
        }
        `,
        { profileId },
        authorization,
      );

    return result.follow;
  }

  async unfollow(
    profileId: string,
    authorization?: string,
  ) {
    const result =
      await this.userGraphqlClient.execute<{
        unfollow: boolean;
      }>(
        `
        mutation Unfollow(
          $profileId: ID!
        ) {
          unfollow(
            profileId: $profileId
          )
        }
        `,
        { profileId },
        authorization,
      );

    return result.unfollow;
  }

  async isFollowing(
    profileId: string,
    authorization?: string,
  ) {
    const result =
      await this.userGraphqlClient.execute<{
        isFollowing: boolean;
      }>(
        `
        query IsFollowing(
          $profileId: ID!
        ) {
          isFollowing(
            profileId: $profileId
          )
        }
        `,
        { profileId },
        authorization,
      );

    return result.isFollowing;
  }

  async isBlocked(
    profileId: string,
    authorization?: string,
  ) {
    const result =
      await this.userGraphqlClient.execute<{
        isBlocked: boolean;
      }>(
        `
        query IsBlocked(
          $profileId: ID!
        ) {
          isBlocked(
            profileId: $profileId
          )
        }
        `,
        { profileId },
        authorization,
      );

    return result.isBlocked;
  }

  async unblock(
    profileId: string,
    authorization?: string,
  ) {
    const result =
      await this.userGraphqlClient.execute<{
        unblock: boolean;
      }>(
        `
        mutation Unblock(
          $profileId: ID!
        ) {
          unblock(
            profileId: $profileId
          )
        }
        `,
        { profileId },
        authorization,
      );

    return result.unblock;
  }

  async followersCount(
    profileId: string,
    authorization?: string,
  ) {
    const result =
      await this.userGraphqlClient.execute<{
        followersCount: number;
      }>(
        `
        query FollowersCount(
          $profileId: ID!
        ) {
          followersCount(
            profileId: $profileId
          )
        }
        `,
        { profileId },
        authorization,
      );

    return result.followersCount;
  }

  async followingCount(
    profileId: string,
    authorization?: string,
  ) {
    const result =
      await this.userGraphqlClient.execute<{
        followingCount: number;
      }>(
        `
        query FollowingCount(
          $profileId: ID!
        ) {
          followingCount(
            profileId: $profileId
          )
        }
        `,
        { profileId },
        authorization,
      );

    return result.followingCount;
  }

  async followers(
    profileId: string,
    input: {
      page: number;
      limit: number;
    },
    authorization?: string,
  ) {
    const result =
      await this.userGraphqlClient.execute<{
        followers: {
          data: any[];
          total: number;
          page: number;
          limit: number;
          totalPages: number;
        };
      }>(
        `
        query Followers(
          $profileId: ID!
          $input: PaginationInput!
        ) {
          followers(
            profileId: $profileId
            input: $input
          ) {
            data {
              id
              username
              display_name
              avatar_url
            }
            total
            page
            limit
            totalPages
          }
        }
        `,
        {
          profileId,
          input,
        },
        authorization,
      );

    return result.followers;
  }

  async following(
    profileId: string,
    input: {
      page: number;
      limit: number;
    },
    authorization?: string,
  ) {
    const result =
      await this.userGraphqlClient.execute<{
        following: {
          data: any[];
          total: number;
          page: number;
          limit: number;
          totalPages: number;
        };
      }>(
        `
        query Following(
          $profileId: ID!
          $input: PaginationInput!
        ) {
          following(
            profileId: $profileId
            input: $input
          ) {
            data {
              id
              username
              display_name
              avatar_url
            }
            total
            page
            limit
            totalPages
          }
        }
        `,
        {
          profileId,
          input,
        },
        authorization,
      );

    return result.following;
  }
}