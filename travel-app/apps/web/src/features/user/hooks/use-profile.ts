

// 'use client';

// import {
//   useCallback,
// } from 'react';

// import {
//   useMutation,
//   useQuery,
// } from '@apollo/client/react';

// import {
//   MY_PROFILE_QUERY,
//   UPDATE_MY_PROFILE_MUTATION,
// } from '../api/profile.queries';

// import type {
//   MyProfileData,
//   UpdateProfileData,
//   UpdateProfileInput,
// } from '../types/profile';

// import {
//   useAuthContext,
// } from '@/features/auth/context/auth-context';

// interface UseProfileOptions {
//   waitForProfile?: boolean;
// }

// const PROFILE_RETRY_COUNT = 10;
// const PROFILE_RETRY_DELAY = 500;

// function sleep(ms: number) {
//   return new Promise<void>((resolve) => {
//     setTimeout(resolve, ms);
//   });
// }

// export function useProfile(
//   options: UseProfileOptions = {},
// ) {
//   const {
//     waitForProfile = false,
//   } = options;

//   const {
//     isLoading: authLoading,
//     isAuthenticated,
//   } = useAuthContext();

//   const {
//     data,
//     loading,
//     error,
//     refetch,
//   } = useQuery<MyProfileData>(
//     MY_PROFILE_QUERY,
//     {
//       skip:
//         authLoading ||
//         !isAuthenticated ||
//         waitForProfile,

//       fetchPolicy: 'network-only',
//     },
//   );

//   const [
//     updateProfileMutation,
//     {
//       loading: updateProfileLoading,
//       error: updateProfileError,
//     },
//   ] = useMutation<UpdateProfileData>(
//     UPDATE_MY_PROFILE_MUTATION,
//   );

//   const updateProfile = async (
//     input: UpdateProfileInput,
//   ) => {
//     const { data } =
//       await updateProfileMutation({
//         variables: {
//           input,
//         },
//       });

//     if (!data?.updateProfile) {
//       throw new Error(
//         'Không thể cập nhật profile.',
//       );
//     }

//     return data.updateProfile;
//   };

//   const loadProfileWithRetry =
//     useCallback(async () => {
//       if (
//         authLoading ||
//         !isAuthenticated
//       ) {
//         return null;
//       }

//       for (
//         let attempt = 0;
//         attempt < PROFILE_RETRY_COUNT;
//         attempt++
//       ) {
//         try {
//           const result =
//             await refetch();

//           const profile =
//             result.data?.myProfile;

//           if (profile) {
//             return profile;
//           }
//         } catch {
//           // User Service có thể
//           // chưa xử lý event user.registered
//         }

//         if (
//           attempt <
//           PROFILE_RETRY_COUNT - 1
//         ) {
//           await sleep(
//             PROFILE_RETRY_DELAY,
//           );
//         }
//       }

//       return null;
//     }, [
//       authLoading,
//       isAuthenticated,
//       refetch,
//     ]);

//   return {
//     profile:
//       data?.myProfile ?? null,

//     loading:
//       authLoading || loading,

//     error,

//     refetch,

//     updateProfile,

//     updateProfileLoading,

//     updateProfileError,

//     loadProfileWithRetry,

//     authLoading,

//     isAuthenticated,

//     waitForProfile,
//   };
// }

"use client";

import {
  useCallback,
} from "react";

import {
  useMutation,
  useQuery,
} from "@apollo/client/react";

import {
  MY_PROFILE_QUERY,
  UPDATE_MY_PROFILE_MUTATION,
} from "../api/profile.queries";

import type {
  MyProfileData,
  UpdateProfileData,
  UpdateProfileInput,
} from "../types/profile";

import {
  useAuthContext,
} from "@/features/auth/context/auth-context";

const PROFILE_RETRY_COUNT = 6;
const PROFILE_RETRY_DELAY = 1000;

function sleep(ms: number) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });
}

export function useProfile() {
  const {
    isLoading: authLoading,
    isAuthenticated,
  } = useAuthContext();

  /*
   * ============================================================
   * GET MY PROFILE
   * ============================================================
   *
   * Chỉ tự gọi khi đã authenticated.
   */
  const {
    data,
    loading,
    error,
    refetch,
  } = useQuery<MyProfileData>(
    MY_PROFILE_QUERY,
    {
      skip:
        authLoading ||
        !isAuthenticated,

      fetchPolicy: "cache-and-network",

      /*
       * Không throw GraphQL error ra ngoài
       * làm React query loop.
       */
      errorPolicy: "all",
    },
  );

  /*
   * ============================================================
   * UPDATE PROFILE
   * ============================================================
   */

  const [
    updateProfileMutation,
    {
      loading:
        updateProfileLoading,

      error:
        updateProfileError,
    },
  ] =
    useMutation<UpdateProfileData>(
      UPDATE_MY_PROFILE_MUTATION,
    );

  const updateProfile = async (
    input: UpdateProfileInput,
  ) => {
    const { data } =
      await updateProfileMutation({
        variables: {
          input,
        },
      });

    if (!data?.updateProfile) {
      throw new Error(
        "Không thể cập nhật profile.",
      );
    }

    return data.updateProfile;
  };

  /*
   * ============================================================
   * RETRY LOAD PROFILE
   * ============================================================
   */

  const loadProfileWithRetry =
    useCallback(async () => {
      if (!isAuthenticated) {
        return null;
      }

      for (
        let attempt = 0;
        attempt < PROFILE_RETRY_COUNT;
        attempt++
      ) {
        try {
          const result =
            await refetch();

          const profile =
            result.data?.myProfile;

          if (profile) {
            return profile;
          }
        } catch {
          /*
           * Profile chưa được User Service
           * tạo xong.
           */
        }

        if (
          attempt <
          PROFILE_RETRY_COUNT - 1
        ) {
          await sleep(
            PROFILE_RETRY_DELAY,
          );
        }
      }

      return null;
    }, [isAuthenticated, refetch]);

  return {
    profile:
      data?.myProfile ?? null,

    loading:
      authLoading || loading,

    error,

    refetch,

    updateProfile,

    updateProfileLoading,

    updateProfileError,

    loadProfileWithRetry,

    authLoading,

    isAuthenticated,
  };
}