import { Injectable, BadGatewayException, HttpException} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { SERVICE_URLS } from '../config/service-url.config';


interface FollowersCountResponse {
  followersCount: number;
}

interface FollowingCountResponse {
  followingCount: number;
}

@Injectable()
export class UserGatewayService {
  constructor(
    private readonly httpService: HttpService,
  ) {}

private async execute<T>( query: string, variables?: Record<string, any>, authorization?: string ): Promise<T> {
  try {
    console.log( '[Gateway -> User Service] Authorization:', authorization ? `${authorization.substring(0, 20)}...` : 'MISSING',);

    const response = await firstValueFrom(
      this.httpService.post(
        SERVICE_URLS.USER,
        {
          query,
          variables,
        },
        {
          headers: {
            'Content-Type': 'application/json',

            ...(authorization ? {Authorization : authorization} : {}),
          },
        },
      ),
    );

    const result = response.data;

    // USER SERVICE GRAPHQL ERROR
    if (result.errors?.length) {
      console.error(
        '[User Service GraphQL Error]',
        result.errors,
      );

      const graphqlError = result.errors[0];
      const message = graphqlError?.extensions?.originalError?.message;

      const errorMessage = Array.isArray(message) ? ( message[0]?.message ??  message[0] )
          : message ?? graphqlError?.message ?? 'User Service request failed';

      const statusCode = graphqlError?.extensions ?.originalError ?.statusCode ?? 500;

      throw new HttpException(
        errorMessage,
        statusCode,
      );
    }

    return result.data;

  } catch (error: any) {

    if (
      error instanceof HttpException
    ) {
      throw error;
    }

    console.error(
      '[Gateway -> User Service HTTP Error]',
      error?.response?.data || error,
    );

    throw new BadGatewayException(
      'User Service không phản hồi',
    );
  }
}

  async myProfile(authorization?: string) {
    const result = await this.execute<{
      myProfile: any;
    }>(
      `
      query MyProfile {
        myProfile {
          id
          username
          display_name
          avatar_url
          cover_url
          bio
          gender
          birthday
          location
          privacy
          created_at
          updated_at
        }
      }
      `,
      undefined,
      authorization,
    );

    return result.myProfile;
  }

  async userProfile(id: string) {
    const result = await this.execute<{
      userProfile: any;
    }>(
      `
      query UserProfile($id: String!) {
        userProfile(id: $id) {
          id
          username
          display_name
          avatar_url
          cover_url
          bio
          gender
          birthday
          location
          privacy
          created_at
          updated_at
        }
      }
      `,
      {
        id,
      },
    );

    return result.userProfile;
  }

  async checkUsername(username: string) {
    const result = await this.execute<{
      checkUsername: boolean;
    }>(
      `
      query CheckUsername($username: String!) {
        checkUsername(username: $username)
      }
      `,
      {
        username,
      },
    );

    return result.checkUsername;
  }

  async getInterestTags() {
    const result = await this.execute<{
      getInterestTags: any[];
    }>(
      `
      query GetInterestTags {
        getInterestTags {
          id
          name
          icon_url
          created_at
        }
      }
      `,
    );

    return result.getInterestTags;
  }

  async updateMyInterests(
  interestIds: string[],
  authorization?: string,
) {
  const result = await this.execute<{
    updateMyInterests: any[];
  }>(
    `
    mutation UpdateMyInterests($interestIds: [ID!]!) {
      updateMyInterests(interestIds: $interestIds) {
        id
        name
        icon_url
        created_at
      }
    }
    `,
    {
      interestIds,
    },
    authorization,
  );

  return result.updateMyInterests;
}



  async searchInterestTags(name: string) {
    const result = await this.execute<{
      searchInterestTags: any[];
    }>(
      `
      query SearchInterestTags($name: String!) {
        searchInterestTags(name: $name) {
          id
          name
          icon_url
          created_at
        }
      }
      `,
      {
        name,
      },
    );

    return result.searchInterestTags;
  }

  async follow(
    profileId: string,
    authorization?: string,
  ) {
    const result = await this.execute<{
      follow: any;
    }>(
      `
      mutation Follow($profileId: ID!) {
        follow(profileId: $profileId) {
          follower_id
          following_id
          created_at
        }
      }
      `,
      {
        profileId,
      },
      authorization,
    );

    return result.follow;
  }

  async unfollow(
    profileId: string,
    authorization?: string,
  ) {
    const result = await this.execute<{
      unfollow: boolean;
    }>(
      `
      mutation Unfollow($profileId: ID!) {
        unfollow(profileId: $profileId)
      }
      `,
      {
        profileId,
      },
      authorization,
    );

    return result.unfollow;
  }

  async isFollowing(
    profileId: string,
    authorization?: string,
  ) {
    const result = await this.execute<{
      isFollowing: boolean;
    }>(
      `
      query IsFollowing($profileId: ID!) {
        isFollowing(profileId: $profileId)
      }
      `,
      {
        profileId,
      },
      authorization,
    );

    return result.isFollowing;
  }

  async isBlocked(
    profileId: string,
    authorization?: string,
  ) {
    const result = await this.execute<{
      isBlocked: boolean;
    }>(
      `
      query IsBlocked($profileId: ID!) {
        isBlocked(profileId: $profileId)
      }
      `,
      {
        profileId,
      },
      authorization,
    );

    return result.isBlocked;
  }

  async unblock(
    profileId: string,
    authorization?: string,
  ) {
    const result = await this.execute<{
      unblock: boolean;
    }>(
      `
      mutation Unblock($profileId: ID!) {
        unblock(profileId: $profileId)
      }
      `,
      {
        profileId,
      },
      authorization,
    );

    return result.unblock;
  }

    async getMyInterests(
    authorization?: string,
  ) {
    const result = await this.execute<{
      getMyInterests: any[];
    }>(
      `
      query GetMyInterests {
        getMyInterests {
          id
          name
          icon_url
          created_at
        }
      }
      `,
      undefined,
      authorization,
    );

    return result.getMyInterests;
  }

    async updateProfile(
    input: {
      username?: string;
      display_name?: string;
      avatar_url?: string;
      cover_url?: string;
      bio?: string;
      gender?: string;
      birthday?: string;
      location?: string;
      privacy?: string;
    },
    authorization?: string,
  ) {
    const result = await this.execute<{
      updateProfile: any;
    }>(
      `
      mutation UpdateProfile($input: UpdateProfileInput!) {
        updateProfile(input: $input) {
          id
          username
          display_name
          avatar_url
          cover_url
          bio
          gender
          birthday
          location
          privacy
          created_at
          updated_at
        }
      }
      `,
      {
        input,
      },
      authorization,
    );

    return result.updateProfile;
  }

  async followersCount(
  profileId: string,
  authorization?: string,
): Promise<number> {
  const data =
    await this.execute<FollowersCountResponse>(
      `
      query FollowersCount($profileId: ID!) {
        followersCount(profileId: $profileId)
      }
      `,
      { profileId },
      authorization,
    );

  return data.followersCount;
}

async followingCount(
  profileId: string,
  authorization?: string,
): Promise<number> {
  const data =
    await this.execute<FollowingCountResponse>(
      `
      query FollowingCount($profileId: ID!) {
        followingCount(profileId: $profileId)
      }
      `,
      { profileId },
      authorization,
    );

  return data.followingCount;
}
}
