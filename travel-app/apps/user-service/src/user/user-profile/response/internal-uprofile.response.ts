export interface InternalUserProfileResponse {
  profileId: string;
  accountId: string;
  username: string;
  avatarUrl: string | null;
}

export interface InternalUserProfilesResponse {
  items: InternalUserProfileResponse[];
}