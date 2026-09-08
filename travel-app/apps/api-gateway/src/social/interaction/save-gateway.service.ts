import { Injectable } from '@nestjs/common';
import { SocialGraphqlClient } from '../clients/social-graphql.client';
import { normalizePostList } from '../common/post-normalizer';
import { SavePostObject } from './types/interaction.types';
import { PaginationInput } from '../post/dto/post.inputs';
import { PostListObject, SocialPostResponse } from '../post/types/post.types';

interface SavePostResponse { savePost: SavePostObject; }
interface UnsavePostResponse { unsavePost: SavePostObject; }
interface IsPostSavedResponse { isPostSaved: boolean; }
interface SavedPostsResponse {
  savedPosts: {
    items: SocialPostResponse[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

@Injectable()
export class SaveGatewayService {
  constructor(
    private readonly socialClient: SocialGraphqlClient,
  ) {}

  async savePost(postId: string, authorization?: string): Promise<SavePostObject> {
    const data = await this.socialClient.execute<SavePostResponse>(
      `
      mutation SavePost($postId: ID!) {
        savePost(postId: $postId) {
          postId
          userId
          savedAt
        }
      }
      `,
      { postId },
      authorization,
    );
    return data.savePost;
  }

  async unsavePost(postId: string, authorization?: string): Promise<SavePostObject> {
    const data = await this.socialClient.execute<UnsavePostResponse>(
      `
      mutation UnsavePost($postId: ID!) {
        unsavePost(postId: $postId) {
          postId
          userId
          savedAt
        }
      }
      `,
      { postId },
      authorization,
    );
    return data.unsavePost;
  }

  async isPostSaved(postId: string, authorization?: string): Promise<boolean> {
    const data = await this.socialClient.execute<IsPostSavedResponse>(
      `
      query IsPostSaved($postId: ID!) {
        isPostSaved(postId: $postId)
      }
      `,
      { postId },
      authorization,
    );
    return data.isPostSaved;
  }

  async savedPosts(pagination: PaginationInput, authorization?: string): Promise<PostListObject> {
    const data = await this.socialClient.execute<SavedPostsResponse>(
      `
      query SavedPosts($pagination: PaginationInput!) {
        savedPosts(pagination: $pagination) {
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
          total
          page
          limit
          totalPages
        }
      }
      `,
      { pagination },
      authorization,
    );
    return normalizePostList(data.savedPosts);
  }
}