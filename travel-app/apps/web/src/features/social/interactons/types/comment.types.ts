export interface CommentAuthor {
  id: string;
  username: string;
  avatarUrl: string | null;
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;

  author: CommentAuthor;

  parentCommentId: string | null;
  content: string;
  createdAt: string;
}

export interface CommentList {
  items: Comment[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
}