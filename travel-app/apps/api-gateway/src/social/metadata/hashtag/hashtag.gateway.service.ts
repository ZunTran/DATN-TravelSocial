import { Injectable } from '@nestjs/common';
import { SocialGraphqlClient } from '../../clients/social-graphql.client';
import { HashtagObject } from '../types/metadata.types';
import { AdminHashtagFilterInput, CreateHashtagInput, UpdateHashtagInput } from './dto/hashtag.input';
import { AdminHashtagListObject } from './types/hashtag.object';

interface HashtagsResponse {
  hashtags: HashtagObject[];
}

interface CreateHashtagResponse {
  createHashtag: HashtagObject;
}

interface UpdateHashtagResponse {
  updateHashtag: HashtagObject;
}

interface AdminHashtagsResponse {
  adminHashtags: AdminHashtagListObject;
}

@Injectable()
export class HashtagGatewayService {
  constructor(
    private readonly socialClient: SocialGraphqlClient,
  ) {}

  async hashtags(): Promise<
    HashtagObject[]
  > {
    const data = await this.socialClient.execute<HashtagsResponse>(
        `
        query Hashtags {
          hashtags {
            id
            name
          }
        }
        `,
      );

    return data.hashtags;
  }

  async createHashtag(
    input: CreateHashtagInput,
    authorization?: string): Promise<HashtagObject> {
    const data = await this.socialClient.execute<CreateHashtagResponse>(
        `
        mutation CreateHashtag(
          $input: CreateHashtagInput!
        ) {
          createHashtag(input: $input) {
            id
            name
          }
        }
        `,
        { input },
        authorization,
      );

    return data.createHashtag;
  }

  async updateHashtag(
    input: UpdateHashtagInput,
    authorization?: string,
  ): Promise<HashtagObject> {
    const data = await this.socialClient.execute<UpdateHashtagResponse>(
        `
        mutation UpdateHashtag(
          $input: UpdateHashtagInput!
        ) {
          updateHashtag(input: $input) {
            id
            name
          }
        }
        `,
        { input },
        authorization,
      );

    return data.updateHashtag;
  }

  async adminHashtags(input: AdminHashtagFilterInput, authorization?: string): Promise<AdminHashtagListObject> {
    const data = await this.socialClient.execute<AdminHashtagsResponse>(
        `
        query AdminHashtags(
          $filter: AdminHashtagFilterInput!
) {
          adminHashtags(filter: $filter) {
            items {
              id
              name
              postCount
            }
            total
            page
            limit
            totalPages
          }
        }
        `,
        { filter: input },
        authorization,
      );

    return data.adminHashtags;
  }

  async adminDeleteHashtag( id: string, authorization?: string ): Promise<boolean> {
    const data = await this.socialClient.execute<{
        adminDeleteHashtag: boolean;
      }>(
        `
        mutation AdminDeleteHashtag(
          $id: ID!
        ) {
          adminDeleteHashtag(id: $id)
        }
        `,
        { id },
        authorization,
      );

    return data.adminDeleteHashtag;
  }
  
}