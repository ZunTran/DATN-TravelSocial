import { Post } from "@/features/social/post/types/post.types";

export interface ExploreUser {
  id: string;
  username: string;
  display_name: string;
  avatar_url?: string | null;
  commonInterestsCount?: number | null;
}

export interface SearchUsersResponse {
  searchUsers: {
    data: ExploreUser[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}



export interface SearchPostsResponse {
  searchPosts: {
    items: Post[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}