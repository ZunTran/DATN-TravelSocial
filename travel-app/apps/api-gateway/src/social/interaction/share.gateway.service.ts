import { Injectable } from '@nestjs/common';
import { SocialGraphqlClient } from '../clients/social-graphql.client';
import { PaginationInput } from '../post/dto/post.inputs';
import { ShareList, ShareObject } from './types/interaction.types';

interface SharePostResponse { sharePost: ShareObject; }
interface SharesResponse { shares: ShareList; }

@Injectable()
export class ShareGatewayService {
  constructor(private readonly socialClient: SocialGraphqlClient) {}

  async sharePost(postId: string, authorization?: string): Promise<ShareObject> {
    const data = await this.socialClient.execute<SharePostResponse>(
      `
      mutation SharePost($postId: ID!) {
        sharePost(postId: $postId) {
          id
          postId
          userId
          createdAt
        }
      }
      `,
      { postId },
      authorization,
    );
    return data.sharePost;
  }

  async shares(postId: string, pagination: PaginationInput, authorization?: string): Promise<ShareList> {
    const data = await this.socialClient.execute<SharesResponse>(
      `
      query Shares($postId: ID!, $pagination: PaginationInput!) {
        shares(postId: $postId, pagination: $pagination) {
          items {
            id
            postId
            userId
            createdAt
          }
          total
          page
          limit
          totalPages
        }
      }
      `,
      { postId, pagination },
      authorization,
    );
    return data.shares;
  }
}