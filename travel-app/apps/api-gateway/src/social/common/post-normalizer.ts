import { PostListObject, PostObject, SocialPostResponse } from "../post/types/post.types";


export function normalizePost(
  post: SocialPostResponse,
): PostObject {
  return {
    ...post,
    createdAt: new Date(post.createdAt),
    updatedAt: new Date(post.updatedAt),
    isPostLiked: post.isPostLiked ?? false,
    isPostSaved: post.isPostSaved ?? false,
    hashtags: post.hashtags ?? [],
  };
}

export function normalizePostList(
  posts: {
    items: SocialPostResponse[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
  },
): PostListObject {
  return {
    ...posts,
    items: posts.items.map(normalizePost),
  };
}