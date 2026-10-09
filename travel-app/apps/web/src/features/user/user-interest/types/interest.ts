export interface InterestTag {
  id: string;
  name: string;
  icon_url?: string | null;
  created_at: string;
}

export interface GetInterestTagsData {
  getInterestTags: InterestTag[];
}

export interface GetMyInterestsData {
  getMyInterests: InterestTag[];
}

export interface UpdateMyInterestsData {
  updateMyInterests: InterestTag[];
}

export interface UpdateMyInterestsVariables {
  interestIds: string[];
}

export interface UserInterestsData {
  getUserInterests: InterestTag[];
}

export interface UserInterestsVariables {
  profileId: string;
}