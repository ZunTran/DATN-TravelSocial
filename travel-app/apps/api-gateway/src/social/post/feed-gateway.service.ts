import {
  Injectable,
} from '@nestjs/common';

import {
  FeedInput,
} from './dto/feed.inputs';

import {
  FeedPageObject,
} from './types/feed.types';

import {
  SocialPostResponse,
} from './types/post.types';

import {
  SocialGraphqlClient,
} from '../clients/social-graphql.client';

import {
  normalizePost,
} from '../common/post-normalizer';

interface FeedResponse {
  feed: {
    items: SocialPostResponse[];
    hasNextPage: boolean;
    endCursor: string | null;
  };
}

@Injectable()
export class FeedGatewayService {
  constructor(
    private readonly socialClient: SocialGraphqlClient,
  ) {}

  async feed(
    input: FeedInput,
    authorization?: string,
  ): Promise<FeedPageObject> {
    const data =
      await this.socialClient.execute<FeedResponse>(
        `
        query Feed(
          $input: FeedInput!
        ) {
          feed(input: $input) {
            items {
              id
              authorId
              categoryId
              locationId
              content
              privacy
              status
              createdAt
              updatedAt
              viewCount
              likeCount
              commentCount
              shareCount
              saveCount

              isPostLiked
              isPostSaved

              authorUsername
              authorAvatar

              media {
                id
                mediaUrl
                mediaType
                displayOrder
              }

              category {
                id
                name
                description
              }

              location {
                id
                name
                address
                latitude
                longitude
                province
              }
            }

            hasNextPage
            endCursor
          }
        }
        `,
        {
          input: {
            cursor: input.cursor,
            limit: input.limit ?? 10,
          },
        },
        authorization,
      );

    return {
      ...data.feed,

      items:
        data.feed.items.map(
          normalizePost,
        ),
    };
  }
}