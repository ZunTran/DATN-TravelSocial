import { Injectable } from '@nestjs/common';
import { FileUpload } from 'graphql-upload-ts';

import { UserGraphqlClient } from '../clients/user-graphql-client';
import { GatewayUpdateProfileInput } from './dto/user-profile.input';
import { GatewaySearchUserInput } from './dto/search-user.input';
import { mapGatewayUserProfile } from './user-profile.mapper';

@Injectable()
export class UserProfileService {
  constructor(
    private readonly userGraphqlClient: UserGraphqlClient,
  ) {}

  
  async myProfile(
    authorization?: string,
  ) {
    const result =
      await this.userGraphqlClient.execute<{
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
            isCompleted
            created_at
            updated_at
          }
        }
        `,
        undefined,
        authorization,
      );

    return mapGatewayUserProfile(result.myProfile);
  }

  async userProfile(id: string) {
    const result =
      await this.userGraphqlClient.execute<{
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
        { id },
      );

    return mapGatewayUserProfile(result.userProfile);
  }

  async profileByUsername(
    username: string,
    authorization?: string,
  ) {
    const result =
      await this.userGraphqlClient.execute<{
        profileByUsername: any;
      }>(
        `
        query ProfileByUsername($username: String!) {
          profileByUsername(username: $username) {
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
            isCompleted
            created_at
            updated_at
          }
        }
        `,
        { username },
        authorization,
      );

    return result.profileByUsername ? mapGatewayUserProfile(result.profileByUsername) : null;
  }

  async checkUsername(username: string) {
    const result =
      await this.userGraphqlClient.execute<{
        checkUsername: boolean;
      }>(
        `
        query CheckUsername($username: String!) {
          checkUsername(username: $username)
        }
        `,
        { username },
      );

    return result.checkUsername;
  }

  async updateProfile(
    input: GatewayUpdateProfileInput,
    authorization?: string,
  ) {
    const result =
      await this.userGraphqlClient.execute<{
        updateProfile: any;
      }>(
        `
        mutation UpdateProfile(
          $input: UpdateProfileInput!
        ) {
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
            isCompleted
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

    return mapGatewayUserProfile(result.updateProfile);
  }

  async updateAvatar(
    avatar: FileUpload,
    authorization?: string,
  ) {
    const result =
      await this.userGraphqlClient.executeUpload<{
        updateAvatar: any;
      }>(
        `
        mutation UpdateAvatar(
          $avatar: Upload!
        ) {
          updateAvatar(
            avatar: $avatar
          ) {
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
            isCompleted
            created_at
            updated_at
          }
        }
        `,
        {
          avatar: null,
        },
        avatar,
        'variables.avatar',
        authorization,
      );

    return mapGatewayUserProfile(result.updateAvatar);
  }


  async getSuggestedUsersByInterests(authorization?: string) {
    const result = await this.userGraphqlClient.execute<{getSuggestedUsersByInterests: any[];
      }>(
        `
        query GetSuggestedUsersByInterests {
          getSuggestedUsersByInterests {
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
            isCompleted
            commonInterestsCount
            created_at
            updated_at
          }
        }
        `,
        undefined,
        authorization
      );
    return result.getSuggestedUsersByInterests.map( mapGatewayUserProfile );
  }

  async searchUsers(input: GatewaySearchUserInput, authorization?: string) {
    const query = `
      query SearchUsers($input: SearchUserInput!) {
        searchUsers(input: $input) {
          data {
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
            isCompleted
            created_at
            updated_at
            commonInterestsCount
          }
          total
          page
          limit
          totalPages
        }
      }
    `;

    const result = await this.userGraphqlClient.execute<{
      searchUsers: {
        data: any[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
      };
    }>(
      query,
      {
        input: {
          keyword: input.keyword?.trim() || undefined,
          page: input.page,
          limit: input.limit,
        },
      },
      authorization,
    );

    return {
      ...result.searchUsers,
      data: result.searchUsers.data.map(mapGatewayUserProfile),
    };

  }


}