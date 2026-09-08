import { Injectable } from '@nestjs/common';
import { SocialGraphqlClient } from '../clients/social-graphql.client';
import { HashtagObject } from '@nestjs/graphql';
import { CreateHashtagInput, UpdateHashtagInput } from './dto/metadata.inputs';

interface HashtagsResponse {
  hashtags: HashtagObject[];
}

interface CreateHashtagResponse {
  createHashtag: HashtagObject;
}

interface UpdateHashtagResponse {
  updateHashtag: HashtagObject;
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
}