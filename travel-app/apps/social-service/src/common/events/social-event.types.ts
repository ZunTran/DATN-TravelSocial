export interface PostLikedEvent {
  postId: string;
  actorId: string;

  actorUsername: string;
  actorDisplayName: string;

  receiverId: string;
  postContentPreview?: string;
  createdAt: string;
}