import { CategoryOption } from "../../metadata/types/category.types";
import { LocationOption } from "../../metadata/types/location.types";
export type PostPrivacy = | "PUBLIC" | "FRIENDS_ONLY" | "PRIVATE" | string;
export type PostStatus = | "DRAFT" | "PUBLISHED" | "ARCHIVED" | "DELETED" | string;
export type PostMediaType = | "IMAGE" | "VIDEO" | string;

export interface PostMedia {
  id: string;
  mediaUrl: string;
  mediaType: PostMediaType;
  displayOrder: number;
}

export interface PostHashtag {
  id: string;
  name: string;
}

export interface Post {
  id: string;
  authorId: string;
  categoryId?: string | null;
  locationId?: string | null;
  content?: string | null;
  privacy: PostPrivacy;
  status: PostStatus;
  createdAt: string;
  updatedAt: string;

  viewCount: number;
  likeCount: number;
  commentCount: number;
  shareCount: number;
  saveCount: number;

  isPostLiked: boolean;
  isPostSaved: boolean;

  authorUsername?: string | null;
  authorAvatar?: string | null;

  media: PostMedia[];

  category?: CategoryOption | null;
  location?: LocationOption | null;
  hashtags: PostHashtag[] | null;
}

export interface PostPagination {
  items: Post[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
}

export interface GetPostsResponse {
  posts: PostPagination;
}

export interface ProfilePostsResponse {
  profilePosts: PostPagination;
}

export interface MyDraftPostsResponse {
  myDraftPosts: PostPagination;
}

export interface CreatePostMediaInput {
  mediaType: PostMediaType;
  displayOrder?: number;
}

export interface UpdatePostMediaInput {
  mediaUrl: string;
  mediaType: PostMediaType;
  displayOrder?: number;
}

export interface CreatePostInput {
  content?: string;
  categoryId?: string | null;
  locationId?: string | null;
  privacy?: 'PUBLIC' | 'PRIVATE';
  status?: 'DRAFT' | 'PUBLISHED';
  hashtagIds?: string[];
  media?: CreatePostMediaInput[];
}

export interface UpdatePostInput {
  id: string;
  content?: string;
  status?: 'DRAFT' | 'PUBLISHED';
  privacy?: 'PUBLIC' | 'PRIVATE';
  categoryId?: string | null;
  locationId?: string | null;
  media?: UpdatePostMediaInput[];
  hashtagIds?: string[];
}