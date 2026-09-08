import { Injectable } from '@nestjs/common';
import { SocialGraphqlClient } from '../clients/social-graphql.client';
import { LikeObject, LikeList } from './types/interaction.types';
import { PaginationInput } from '../post/dto/post.inputs';

interface LikePostResponse {
  likePost: LikeObject;
}

interface UnlikePostResponse {
  unlikePost: LikeObject;
}

interface IsPostLikedResponse {
  isPostLiked: boolean;
}

interface LikesResponse {
  likes: LikeList;
}

@Injectable()
export class LikeGatewayService {
  constructor(private readonly socialClient: SocialGraphqlClient) {}

  async likePost(postId: string, authorization?: string): Promise<LikeObject> {
    const data = await this.socialClient.execute<LikePostResponse>(
      `
      mutation LikePost($postId: ID!) {
        likePost(postId: $postId) {
          postId
          userId
          createdAt
        }
      }
      `,
      { postId },
      authorization,
    );
    return data.likePost;
  }

  async unlikePost(postId: string, authorization?: string): Promise<LikeObject> {
    const data = await this.socialClient.execute<UnlikePostResponse>(
      `
      mutation UnlikePost($postId: ID!) {
        unlikePost(postId: $postId) {
          postId
          userId
          createdAt
        }
      }
      `,
      { postId },
      authorization,
    );
    return data.unlikePost;
  }

  async isPostLiked(postId: string, authorization?: string): Promise<boolean> {
    const data = await this.socialClient.execute<IsPostLikedResponse>(
      `
      query IsPostLiked($postId: ID!) {
        isPostLiked(postId: $postId)
      }
      `,
      { postId },
      authorization,
    );
    return data.isPostLiked;
  }

  async likes(postId: string, pagination: PaginationInput, authorization?: string): Promise<LikeList> {
    const data = await this.socialClient.execute<LikesResponse>(
      `
      query Likes($postId: ID!, $pagination: PaginationInput!) {
        likes(postId: $postId, pagination: $pagination) {
          items {
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
    return data.likes;
  }
}