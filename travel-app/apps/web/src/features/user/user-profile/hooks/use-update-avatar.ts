'use client';

import { useMutation } from '@apollo/client/react';
import {UPDATE_AVATAR_MUTATION,MY_PROFILE_QUERY} from '../api/profile.queries';
import type { UserProfile } from '../types/profile';

interface UpdateAvatarData {
  updateAvatar: UserProfile;
}

interface UpdateAvatarVariables {
  avatar: File;
}

export function useUpdateAvatar() {
  const [
    mutate,
    {loading, error},
  ] = useMutation<
    UpdateAvatarData,
    UpdateAvatarVariables
  >(UPDATE_AVATAR_MUTATION,
    {
      update( cache,{ data }) {
        const updatedProfile = data?.updateAvatar;
        if (!updatedProfile) 
          return;

        cache.writeQuery({
            query: MY_PROFILE_QUERY,
            data: {myProfile:updatedProfile},
        });
      },
    },
  );

  const updateAvatar = async (file: File) => {
    const { data } = await mutate({
        variables: {avatar: file},
      });

    if (!data?.updateAvatar) 
      throw new Error('Không thể cập nhật avatar');
    
    return data.updateAvatar;
  };

  return {
    updateAvatar,
    loading,
    error,
  };
}