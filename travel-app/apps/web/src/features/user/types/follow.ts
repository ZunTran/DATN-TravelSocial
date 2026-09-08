export interface Follow {
  follower_id: string;
  following_id: string;
  created_at: string;
}

export interface FollowData {
  follow: Follow;
}

export interface UnfollowData {
  unfollow: boolean;
}

export interface IsFollowingData {
  isFollowing: boolean;
}

export interface FollowUser {
  id: string;
  username: string;
  display_name: string;
  avatar_url?: string | null;
}

export interface FollowPage {
  data: FollowUser[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface FollowersData {
  followers: FollowPage;
}

export interface FollowingData {
  following: FollowPage;
}