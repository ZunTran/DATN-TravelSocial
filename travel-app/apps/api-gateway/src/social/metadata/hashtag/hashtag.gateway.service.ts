import { Injectable } from '@nestjs/common';
import { SocialGraphqlClient } from '../../clients/social-graphql.client';
import { AdminHashtagFilterInput, CreateHashtagInput, HashtagFilterInput, UpdateHashtagInput } from './dto/hashtag.input';
import { AdminHashtagListObject, HashtagObject, HashtagPageObject } from './types/hashtag.object';
import { ADMIN_DELETE_HASHTAG_MUTATION, ADMIN_HASHTAGS_QUERY, CREATE_HASHTAG_MUTATION, HASHTAG_OPTIONS_QUERY, HASHTAGS_QUERY, UPDATE_HASHTAG_MUTATION } from './hashtag.queries';
import { AdminHashtagsResponse, CreateHashtagResponse, HashtagOptionsResponse, HashtagsResponse, UpdateHashtagResponse } from './types/hashtag.types';

@Injectable()
export class HashtagGatewayService {
  constructor(
    private readonly socialClient: SocialGraphqlClient,
  ) {}

  async hashtags(): Promise<HashtagObject[]> {
    const data = await this.socialClient.execute<HashtagsResponse>(HASHTAGS_QUERY );
    return data.hashtags;
  }

  async hashtagOptions(
    filter: HashtagFilterInput,
    authorization?: string,
  ): Promise<HashtagPageObject> {
    const data =
      await this.socialClient.execute<HashtagOptionsResponse>(
        HASHTAG_OPTIONS_QUERY,
        {
          filter,
        },
        authorization,
      );

    return data.hashtagOptions;
  }

  async createHashtag(
    input: CreateHashtagInput,
    authorization?: string,
  ): Promise<HashtagObject> {
    const data =
      await this.socialClient.execute<CreateHashtagResponse>(
        CREATE_HASHTAG_MUTATION,
        { input },
        authorization,
      );

    return data.createHashtag;
  }

  async updateHashtag(
    input: UpdateHashtagInput,
    authorization?: string,
  ): Promise<HashtagObject> {
    const data =
      await this.socialClient.execute<UpdateHashtagResponse>(
        UPDATE_HASHTAG_MUTATION,
        { input },
        authorization,
      );

    return data.updateHashtag;
  }

  async adminHashtags(
    input: AdminHashtagFilterInput,
    authorization?: string,
  ): Promise<AdminHashtagListObject> {
    const data =
      await this.socialClient.execute<AdminHashtagsResponse>(
        ADMIN_HASHTAGS_QUERY,
        {
          filter: input,
        },
        authorization,
      );

    return data.adminHashtags;
  }

  async adminDeleteHashtag(
    id: string,
    authorization?: string,
  ): Promise<boolean> {
    const data =
      await this.socialClient.execute<{
        adminDeleteHashtag: boolean;
      }>(
        ADMIN_DELETE_HASHTAG_MUTATION,
        { id },
        authorization,
      );

    return data.adminDeleteHashtag;
  }
}