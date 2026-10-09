export type NotificationType =
  | 'NEW_FOLLOWER'
  | 'POST_LIKED'
  | 'POST_COMMENTED'
  | 'NEW_POST';

export interface Notification {
  id: string;
  receiverId: string;
  senderId?: string | null;
  type: NotificationType;
  message: string;
  postId?: string | null;
  isRead: boolean;
  createdAt: string;
}

export interface NotificationPage {
  data: Notification[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}