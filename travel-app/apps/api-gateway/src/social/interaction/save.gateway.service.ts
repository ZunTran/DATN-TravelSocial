import { Injectable } from '@nestjs/common';
import { SocialGraphqlClient } from '../clients/social-graphql.client';

import { SavePostObject } from './types/interaction.types';
import { PaginationInput } from '../post/dto/post.inputs';
import { PostListObject, SocialPostResponse } from '../post/types/post.types';
import { normalizePostList } from '../common/post-normalizer';

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
    hasNextPage: boolean;

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

  async savedPosts(
  profileId: string,
  pagination: PaginationInput,
  authorization?: string,
): Promise<PostListObject> {
  console.log("========== SAVED POSTS GATEWAY ==========");
console.log("profileId:", profileId);
console.log("pagination:", pagination);
console.log("authorization:", authorization ? "HAS TOKEN" : "NO TOKEN");
  const data = await this.socialClient.execute<SavedPostsResponse>(
    `
      query SavedPosts(
        $profileId: ID!
        $pagination: PaginationInput!
      ) {
        savedPosts(
          profileId: $profileId
          pagination: $pagination
        ) {
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
          hasNextPage
        }
      }
    `,
    {
      profileId,
      pagination,
    },
    authorization,
  );

  return normalizePostList(data.savedPosts);
}
}