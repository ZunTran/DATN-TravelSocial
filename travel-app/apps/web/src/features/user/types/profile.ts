export interface UserProfile {
  id: string;
  username: string;
  display_name: string;

  avatar_url?: string | null;
  cover_url?: string | null;

  bio?: string | null;
  gender?: string | null;
  birthday?: string | null;
  location?: string | null;
  privacy: string;

  isCompleted: boolean;

  created_at: string;
  updated_at: string;
}

export interface MyProfileData {
  myProfile: UserProfile;
}

export interface UpdateProfileInput {
  username?: string;
  display_name?: string;
  avatar_url?: string;
  cover_url?: string;
  bio?: string;
  gender?: string;
  birthday?: string;
  location?: string;
  privacy?: string;
}

export interface UpdateProfileData {
  updateProfile: UserProfile;
}

export interface ProfileByUsernameData {
  profileByUsername: UserProfile;
}

export interface ProfileByUsernameVariables {
  username: string;
}