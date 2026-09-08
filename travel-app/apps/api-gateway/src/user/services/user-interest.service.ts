import { Injectable } from '@nestjs/common';

import { UserGraphqlClient } from '../clients/user-graphql-client';
import type { FileUpload } from 'graphql-upload-ts';

@Injectable()
export class UserInterestService {
  constructor(
    private readonly userGraphqlClient: UserGraphqlClient,
  ) {}

  async getInterestTags() {
    const result =
      await this.userGraphqlClient.execute<{
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

  async searchInterestTags(name: string) {
    const result =
      await this.userGraphqlClient.execute<{
        searchInterestTags: any[];
      }>(
        `
        query SearchInterestTags(
          $name: String!
        ) {
          searchInterestTags(name: $name) {
            id
            name
            icon_url
            created_at
          }
        }
        `,
        { name },
      );

    return result.searchInterestTags;
  }

  async getMyInterests(
    authorization?: string,
  ) {
    const result =
      await this.userGraphqlClient.execute<{
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

  async getUserInterests(
    profileId: string,
  ) {
    const result =
      await this.userGraphqlClient.execute<{
        getUserInterests: any[];
      }>(
        `
        query GetUserInterests(
          $profileId: ID!
        ) {
          getUserInterests(
            profileId: $profileId
          ) {
            id
            name
            icon_url
            created_at
          }
        }
        `,
        { profileId },
      );

    return result.getUserInterests;
  }

  async updateMyInterests(
    interestIds: string[],
    authorization?: string,
  ) {
    const result =
      await this.userGraphqlClient.execute<{
        updateMyInterests: any[];
      }>(
        `
        mutation UpdateMyInterests(
          $interestIds: [ID!]!
        ) {
          updateMyInterests(
            interestIds: $interestIds
          ) {
            id
            name
            icon_url
            created_at
          }
        }
        `,
        { interestIds },
        authorization,
      );

    return result.updateMyInterests;
  }

  async getInterestTagsPaginated(
  input: {
    page: number;
    limit: number;
    search?: string;
  },
  authorization?: string,
) {
  const result =
    await this.userGraphqlClient.execute<{
      getInterestTagsPaginated: {
        data: any[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
      };
    }>(
      `
      query GetInterestTagsPaginated(
        $input: GetInterestsInput!
      ) {
        getInterestTagsPaginated(
          input: $input
        ) {
          data {
            id
            name
            icon_url
            created_at
          }
          total
          page
          limit
          totalPages
        }
      }
      `,
      {
        input,
      },
      authorization,
    );

  return result.getInterestTagsPaginated;
}

async createInterestTag(
  input: { name: string; icon_url?: string },
  icon?: FileUpload,
  authorization?: string,
) {
  console.log('========== GATEWAY CREATE INTEREST ==========');
  console.log('INPUT:', input);
  console.log('INPUT NAME:', input?.name);
  console.log('ICON:', icon?.filename);
  console.log('==============================================');
  const result =
    await this.userGraphqlClient.executeUpload<{
      createInterestTag: any;
    }>(
      `
      mutation CreateInterestTag(
        $input: CreateInterestInput!
        $icon: Upload
      ) {
        createInterestTag(
          input: $input
          icon: $icon
        ) {
          id
          name
          icon_url
          created_at
        }
      }
      `,
      {
        input: {
          name: input.name,
          ...(input.icon_url
            ? { icon_url: input.icon_url }
            : {}),
        },
        icon: null,
      },
      icon,
      'variables.icon',
      authorization,
    );

  return result.createInterestTag;
}



async updateInterestTag(
  id: string,
  input: {
    name?: string;
    icon_url?: string;
  },
  icon?: FileUpload,
  authorization?: string,
) {
  const result =
    await this.userGraphqlClient.executeUpload<{
      updateInterestTag: any;
    }>(
      `
      mutation UpdateInterestTag(
        $id: ID!
        $input: UpdateInterestInput!
        $icon: Upload
      ) {
        updateInterestTag(
          id: $id
          input: $input
          icon: $icon
        ) {
          id
          name
          icon_url
          created_at
        }
      }
      `,
      {
        id: id,
        input: {
          ...(input.name !== undefined
            ? { name: input.name }
            : {}),
          ...(input.icon_url !== undefined
            ? { icon_url: input.icon_url }
            : {}),
        },
        icon: null,
      },
      icon,
      'variables.icon',
      authorization,
    );

  return result.updateInterestTag;
}

async deleteInterestTag(
  id: string,
  authorization?: string,
) {
  const result =
    await this.userGraphqlClient.execute<{
      deleteInterestTag: boolean;
    }>(
      `
      mutation DeleteInterestTag(
        $id: ID!
      ) {
        deleteInterestTag(id: $id)
      }
      `,
      {
        id,
      },
      authorization,
    );

  return result.deleteInterestTag;
}

}