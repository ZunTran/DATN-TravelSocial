import { UserProfileSnapshot } from '../user-profile/user-profile.types';

export interface FollowingProfileIdsResponse {
  profileId: string;
  followingProfileIds: string[];
}

export interface FollowRelationResponse {
  followerId: string;
  followingId: string;
  createdAt: string;
}

export interface FollowStatusResponse {
  isFollowing: boolean;
}

export interface FollowingProfilesResponse {
  items: UserProfileSnapshot[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}