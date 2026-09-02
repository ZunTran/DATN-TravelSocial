export interface Story {
  id: string;

  userId: string;
  username: string;
  avatarUrl?: string | null;

  mediaUrl: string;
  mediaType: "IMAGE" | "VIDEO";

  createdAt: string;
  expiresAt: string;

  viewed?: boolean;
}

export interface StoryGroup {
  userId: string;
  username: string;
  avatarUrl?: string | null;

  stories: Story[];

  hasUnviewedStories: boolean;
}
