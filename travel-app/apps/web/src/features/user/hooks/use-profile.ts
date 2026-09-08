"use client";

import {
  // useCallback,
  useEffect,
  useState,
} from "react";

import {
  useMutation,
  useQuery,
} from "@apollo/client/react";

import {
  MY_PROFILE_QUERY,
  PROFILE_BY_USERNAME_QUERY,
  UPDATE_MY_PROFILE_MUTATION,
} from "../api/profile.queries";

import type {
  MyProfileData,
  ProfileByUsernameData,
  ProfileByUsernameVariables,
  UpdateProfileData,
  UpdateProfileInput,
  UserProfile,
} from "../types/profile";

import {
  useAuthContext,
} from "@/features/auth/context/auth-context";

export const PROFILE_STORAGE_KEY = "current-profile";
// const PROFILE_RETRY_COUNT = 6;
// const PROFILE_RETRY_DELAY = 1000;

// function sleep(ms: number) {
//   return new Promise<void>((resolve) => {
//     setTimeout(resolve, ms);
//   });
// }

function getStoredProfile() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const stored =
      window.localStorage.getItem(
        PROFILE_STORAGE_KEY,
      );

    if (!stored) {
      return null;
    }

    return JSON.parse(stored);
  } catch (error) {
    console.error("Failed to read stored profile:",error);

    return null;
  }
}

function saveStoredProfile(
  profile: MyProfileData["myProfile"],
) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(
      PROFILE_STORAGE_KEY,
      JSON.stringify(profile),
    );
  } catch (error) {
    console.error(
      "Failed to save profile:",
      error,
    );
  }
}

function removeStoredProfile() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(
    PROFILE_STORAGE_KEY,
  );
}

export function useProfile() {
  const {
    isLoading: authLoading,
    isAuthenticated,
  } = useAuthContext();

  const [ storedProfile, setStoredProfile ] = useState<MyProfileData["myProfile"] | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      setStoredProfile(null);
      return;
    }

    const profile = getStoredProfile();

    if (profile) {
      setStoredProfile(profile);
    }
  }, [isAuthenticated]);

  const {
    data,
    loading,
    error,
    refetch,
  } = useQuery<MyProfileData>(
    MY_PROFILE_QUERY,
    {
      skip: authLoading || !isAuthenticated,
      fetchPolicy: "cache-and-network",
      errorPolicy: "all",
    },
  );


  const serverProfile = data?.myProfile ?? null;
  const profile = serverProfile ?? storedProfile;

  useEffect(() => {
    if (!serverProfile) 
      return;
    
    saveStoredProfile( serverProfile);
    setStoredProfile(serverProfile);
  }, [serverProfile]);

  const [
    updateProfileMutation,
    {
      loading: updateProfileLoading,
      error: updateProfileError,
    },
  ] =
    useMutation<UpdateProfileData>( UPDATE_MY_PROFILE_MUTATION,
      {
    update(cache, { data }) {
      const updatedProfile = data?.updateProfile;

      if (!updatedProfile) {
        return;
      }

      cache.writeQuery<MyProfileData>({
        query: MY_PROFILE_QUERY,
        data: {
          myProfile: updatedProfile,
        },
      });
    },
  },
    );

  const updateProfile =
    async (
      input: UpdateProfileInput,
    ) => {
      const { data } = await updateProfileMutation({ variables: { input } });

      if (!data?.updateProfile) {
        throw new Error("Không thể cập nhật profile.");
      }

      const updatedProfile = data.updateProfile;
      saveStoredProfile( updatedProfile);
      setStoredProfile( updatedProfile);

      return updatedProfile;
    };

  useEffect(() => {
    if (
      !authLoading &&
      !isAuthenticated
    ) {
      removeStoredProfile();
      setStoredProfile(null);
    }
  }, [
    authLoading,
    isAuthenticated,
  ]);


  return {
    profile,

    loading:
      authLoading || loading,

    error,

    refetch,
    updateProfile,
    updateProfileLoading,
    updateProfileError,

    authLoading,

    isAuthenticated,
  };
}


export function useProfileByUsername(username?: string) {
  const { data, loading, error, refetch } = useQuery<
    ProfileByUsernameData, ProfileByUsernameVariables
  >(PROFILE_BY_USERNAME_QUERY, {
    variables: {
      username: username ?? "",
    },
    skip: !username,
    fetchPolicy: "cache-and-network",
  });

  return {
    profile: data?.profileByUsername ?? null,
    loading,
    error,
    refetch,
  };

}