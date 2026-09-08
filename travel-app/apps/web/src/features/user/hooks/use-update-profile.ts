'use client';

import { useMutation } from '@apollo/client/react';

import {
  UPDATE_MY_PROFILE_MUTATION,
} from '../api/profile.queries';

import type { UserProfile } from '../types/profile';

interface UpdateProfileResponse {
  updateProfile: UserProfile;
}

interface UpdateProfileVariables {
  input: {
    username: string;
    display_name: string;
    bio: string | null;
    gender: string | null;
    birthday: string | null;
    location: string | null;
    privacy: string;
  };
}

function extractErrorMessage(error: any): string {
  const graphQLError =
    error?.graphQLErrors?.[0];

  const originalMessage =
    graphQLError
      ?.extensions
      ?.originalError
      ?.message;

  if (Array.isArray(originalMessage)) {
    const firstError = originalMessage[0];

    if (
      typeof firstError === 'object' &&
      firstError !== null &&
      typeof firstError.message === 'string'
    ) {
      return firstError.message;
    }

    if (
      typeof firstError === 'string'
    ) {
      return firstError;
    }
  }

  // fallback nếu backend trả string
  if (
    typeof originalMessage === 'string'
  ) {
    return originalMessage;
  }

  // fallback cuối cùng
  return (
    error?.message ||'Không thể cập nhật profile.'
  );
}

export function useUpdateProfile() {
  const [
    updateProfileMutation,
    {
      loading,
      error,
    },
  ] = useMutation<
    UpdateProfileResponse,
    UpdateProfileVariables
  >(UPDATE_MY_PROFILE_MUTATION);

  const updateProfile = async (
    input: UpdateProfileVariables['input'],
  ): Promise<UserProfile> => {
    try {
      const result =
        await updateProfileMutation({
          variables: {
            input,
          },

          update(cache, { data }) {
            const updatedProfile =
              data?.updateProfile;

            if (!updatedProfile) {
              return;
            }

            cache.modify({
              fields: {
                myProfile() {
                  return updatedProfile;
                },
              },
            });
          },
        });

      if (!result.data?.updateProfile) {
        throw new Error(
          'Không thể cập nhật profile.',
        );
      }

      return result.data.updateProfile;
    } catch (err: any) {
        throw new Error( extractErrorMessage(err));
    }
  };

  return {
    updateProfile,
    loading,
    error,
  };
}

