export type PostPrivacy =
  | "PUBLIC"
  | "FRIENDS_ONLY"
  | "PRIVATE"
  | string;

export type PostStatus =
  | "DRAFT"
  | "PUBLISHED"
  | "ARCHIVED"
  | "DELETED"
  | string;

export type PostMediaType =
  | "IMAGE"
  | "VIDEO"
  | string;

export interface PostMedia {
  id: string;
  mediaUrl: string;
  mediaType: PostMediaType;
  displayOrder: number;
}

export interface PostCategory {
  id: string;
  name: string;
  description?: string | null;
}

export interface PostLocation {
  id: string;
  name: string;
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  province?: string | null;
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

  category?: PostCategory | null;
  location?: PostLocation | null;
}

export interface GetPostsResponse {
  posts: {
    items: Post[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
