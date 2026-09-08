import type { Post } from "../post/types/post.types";

export interface Feed {
  items: Post[];

  hasNextPage: boolean;

  endCursor: string | null;
}

export interface FeedResponse {
  feed: Feed;
}