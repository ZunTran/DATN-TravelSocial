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