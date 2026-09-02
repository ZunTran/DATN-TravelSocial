// 'use client';

// import { ProfilePage } from '@/features/user/components/profile/profile-page';

// import { useProfile } from '@/features/user/hooks/use-profile';
// import { useMyInterests } from '@/features/user/hooks/use-my-interests';
// import { usePosts } from '@/features/social/hooks/use-posts';
// import { useAuthContext } from '@/features/auth/context/auth-context';
// import { useFollowCounts } from '@/features/user/hooks/use-follow-counts';

// import ProfilePageSkeleton from '@/features/social/components/post-grid-skeleton';

// export default function ProfileRoute() {
//   const {
//     isLoading: authLoading,
//     isAuthenticated,
//   } = useAuthContext();

//   const {
//     profile,
//     loading: profileLoading,
//     error: profileError,
//   } = useProfile();

//   const {
//     followerCount,
//     followingCount,
//     loading: followCountsLoading,
//   } = useFollowCounts(
//     profile?.id ?? '',
//     {
//       skip: !profile,
//     },
//   );

//   const {
//     interests,
//     loading: interestsLoading,
//     error: interestsError,
//   } = useMyInterests();

//   const {
//     posts,
//     total: postTotal,
//     loading: postsLoading,
//     loadingMore: postsLoadingMore,
//     hasMore,
//     loadMore,
//   } = usePosts(
//     1,
//     3,
//     profile
//       ? {
//           authorId: profile.id,
//         }
//       : undefined,
//   );

//   /**
//    * Auth đang restore session
//    */
//   if (authLoading) {
//     return <ProfilePageSkeleton />;
//   }

//   /**
//    * Chưa login
//    */
//   if (!isAuthenticated) {
//     return (
//       <div className="mx-auto max-w-5xl p-6">
//         Please login to view your profile.
//       </div>
//     );
//   }

//   /**
//    * Chỉ profile là critical
//    *
//    * Không block page vì:
//    * interests
//    * posts
//    * counts
//    */
//   if (profileLoading) {
//     return <ProfilePageSkeleton />;
//   }

//   if (profileError) {
//     return (
//       <div className="mx-auto max-w-5xl p-6">
//         <p className="text-destructive">
//           Failed to load profile.
//         </p>

//         <p className="mt-2 text-sm text-muted-foreground">
//           {profileError.message}
//         </p>
//       </div>
//     );
//   }

//   if (!profile) {
//     return (
//       <div className="mx-auto max-w-5xl p-6">
//         Profile not found.
//       </div>
//     );
//   }

//   return (
//     <div className="mx-auto max-w-5xl p-6">
//       <ProfilePage
//         profile={profile}
//         isOwnProfile={true}
//         isFollowing={false}

//         postCount={
//           postTotal ??
//           posts.length
//         }

//         followerCount={
//           followerCount
//         }

//         followingCount={
//           followingCount
//         }

//         interests={
//           interests ?? []
//         }

//         stories={[]}

//         posts={posts}

//         postsLoading={
//           postsLoading &&
//           posts.length === 0
//         }

//         postsLoadingMore={
//           postsLoadingMore
//         }

//         hasMorePosts={
//           hasMore
//         }

//         onLoadMorePosts={
//           loadMore
//         }

//         savedPosts={[]}
//       />
//     </div>
//   );
// }







// 'use client';

// import {
//   useEffect,
//   useState,
// } from 'react';

// import {
//   ProfilePage,
// } from '@/features/user/components/profile/profile-page';

// import {
//   useProfile,
// } from '@/features/user/hooks/use-profile';

// import {
//   useMyInterests,
// } from '@/features/user/hooks/use-my-interests';

// import {
//   usePosts,
// } from '@/features/social/hooks/use-posts';

// import {
//   useAuthContext,
// } from '@/features/auth/context/auth-context';

// import {
//   useFollowCounts,
// } from '@/features/user/hooks/use-follow-counts';

// export default function ProfileRoute() {
//   const {
//     isLoading: authLoading,
//     isAuthenticated,
//   } = useAuthContext();

//   const {
//     profile,
//     loading: profileLoading,
//     error: profileError,
//     loadProfileWithRetry,
//   } = useProfile({
//     waitForProfile: true,
//   });

//   const [
//     waitingForProfile,
//     setWaitingForProfile,
//   ] = useState(true);

//   const [
//     profileLoadFailed,
//     setProfileLoadFailed,
//   ] = useState(false);

//   /*
//    * ============================================================
//    * WAIT FOR PROFILE CREATED BY USER SERVICE
//    * ============================================================
//    */

//   useEffect(() => {
//     if (
//       authLoading ||
//       !isAuthenticated
//     ) {
//       return;
//     }

//     let cancelled = false;

//     const loadProfile = async () => {
//       setWaitingForProfile(true);
//       setProfileLoadFailed(false);

//       const result =
//         await loadProfileWithRetry();

//       if (cancelled) {
//         return;
//       }

//       if (!result) {
//         setProfileLoadFailed(true);
//       }

//       setWaitingForProfile(false);
//     };

//     loadProfile();

//     return () => {
//       cancelled = true;
//     };
//   }, [
//     authLoading,
//     isAuthenticated,
//     loadProfileWithRetry,
//   ]);

//   /*
//    * ============================================================
//    * INTERESTS
//    * ============================================================
//    */

//   const {
//     interests,
//     loading: interestsLoading,
//   } = useMyInterests();

//   /*
//    * ============================================================
//    * FOLLOW COUNTS
//    * ============================================================
//    */

//   const {
//     followerCount,
//     followingCount,
//     loading: followCountsLoading,
//   } = useFollowCounts(
//     profile?.id ?? '',
//     {
//       skip: !profile,
//     },
//   );

//   /*
//    * ============================================================
//    * POSTS
//    * ============================================================
//    */

//   const {
//     posts,
//     total: postTotal,
//     loading: postsLoading,
//   } = usePosts(
//     1,
//     3,
//     profile
//       ? {
//           authorId: profile.id,
//         }
//       : undefined,
//   );

//   /*
//    * ============================================================
//    * AUTH LOADING
//    * ============================================================
//    */

//   if (authLoading) {
//     return (
//       <div className="mx-auto max-w-5xl p-6">
//         Loading session...
//       </div>
//     );
//   }

//   /*
//    * ============================================================
//    * NOT AUTHENTICATED
//    * ============================================================
//    */

//   if (!isAuthenticated) {
//     return (
//       <div className="mx-auto max-w-5xl p-6">
//         Please login to view your profile.
//       </div>
//     );
//   }

//   /*
//    * ============================================================
//    * WAITING FOR USER SERVICE
//    * ============================================================
//    */

//   if (
//     waitingForProfile ||
//     profileLoading
//   ) {
//     return (
//       <div className="mx-auto max-w-5xl p-6">
//         <div className="space-y-6">
//           <div className="h-48 animate-pulse rounded-2xl bg-muted" />

//           <div className="space-y-3">
//             <div className="h-6 w-48 animate-pulse rounded bg-muted" />
//             <div className="h-4 w-72 animate-pulse rounded bg-muted" />
//           </div>

//           <div className="h-32 animate-pulse rounded-2xl bg-muted" />

//           <div className="text-center text-sm text-muted-foreground">
//             Setting up your profile...
//           </div>
//         </div>
//       </div>
//     );
//   }

//   /*
//    * ============================================================
//    * PROFILE CREATION FAILED
//    * ============================================================
//    */

//   if (
//     profileLoadFailed ||
//     profileError ||
//     !profile
//   ) {
//     return (
//       <div className="mx-auto max-w-5xl p-6">
//         <div className="rounded-2xl border bg-card px-6 py-16 text-center">
//           <p className="text-sm font-medium">
//             We couldn't create your profile yet.
//           </p>

//           <p className="mt-2 text-sm text-muted-foreground">
//             Please refresh the page and try again.
//           </p>
//         </div>
//       </div>
//     );
//   }

//   /*
//    * ============================================================
//    * PROFILE EXISTS
//    * ============================================================
//    */

//   return (
//     <div className="mx-auto max-w-5xl p-6">
//       <ProfilePage
//         profile={profile}

//         isOwnProfile={true}
//         isFollowing={false}

//         postCount={
//           postTotal ??
//           posts?.length ??
//           0
//         }

//         followerCount={
//           followerCount
//         }

//         followingCount={
//           followingCount
//         }

//         interests={
//           interests ?? []
//         }

//         stories={[]}

//         posts={
//           posts ?? []
//         }

//         savedPosts={[]}

//         postsLoading={
//           postsLoading &&
//           (posts?.length ?? 0) === 0
//         }
//       />
//     </div>
//   );
// }


"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  ProfilePage,
  ProfileSetup,
} from "@/features/user/components/profile";

import {
  useProfile,
} from "@/features/user/hooks/use-profile";

export default function ProfileRoute() {
  const {
    profile,
    loading: profileLoading,
    error: profileError,
    loadProfileWithRetry,
    updateProfile,
    isAuthenticated,
    authLoading,
  } = useProfile();

  const [
    loadingProfile,
    setLoadingProfile,
  ] = useState(true);

  const [
    setupMode,
    setSetupMode,
  ] = useState(false);

  /*
   * ============================================================
   * LOAD PROFILE
   * ============================================================
   */

  useEffect(() => {
    if (
      authLoading ||
      !isAuthenticated
    ) {
      return;
    }

    let cancelled = false;

    const load = async () => {
      setLoadingProfile(true);

      const result =
        await loadProfileWithRetry();

      if (cancelled) {
        return;
      }

      /*
       * result có profile hoặc null.
       */
      setLoadingProfile(false);
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [
    authLoading,
    isAuthenticated,
    loadProfileWithRetry,
  ]);

  /*
   * ============================================================
   * CHECK PROFILE SETUP
   * ============================================================
   */

  useEffect(() => {
    if (!profile) {
      return;
    }

    const setupKey =
      `profileSetupDone:${profile.id}`;

    const setupDone =
      localStorage.getItem(setupKey);

    setSetupMode(
      setupDone !== "true",
    );
  }, [profile]);

  /*
   * ============================================================
   * AUTH LOADING
   * ============================================================
   */

  if (authLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-sm text-muted-foreground">
          Loading session...
        </p>
      </div>
    );
  }

  /*
   * ============================================================
   * NOT LOGIN
   * ============================================================
   */

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p>
          Please login to view your profile.
        </p>
      </div>
    );
  }

  /*
   * ============================================================
   * WAITING FOR PROFILE
   * ============================================================
   */

  if (
    profileLoading ||
    loadingProfile
  ) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <p className="font-medium">
            Setting up your profile...
          </p>

          <p className="mt-2 text-sm text-muted-foreground">
            Please wait a moment.
          </p>
        </div>
      </div>
    );
  }

  /*
   * ============================================================
   * PROFILE NOT FOUND
   * ============================================================
   */

  if (!profile) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <p className="font-medium text-destructive">
            Profile was not created.
          </p>

          <p className="mt-2 text-sm text-muted-foreground">
            {profileError?.message ??
              "User Service did not create your profile."}
          </p>
        </div>
      </div>
    );
  }

  /*
   * ============================================================
   * PROFILE SETUP
   * ============================================================
   */

  if (setupMode) {
    return (
      <div className="mx-auto max-w-5xl px-6">
        <ProfileSetup
          profile={profile}
          onUpdate={async (input) => {
            const updated =
              await updateProfile(input);

            /*
             * Chỉ đánh dấu hoàn thành
             * sau khi update thành công.
             */
            localStorage.setItem(
              `profileSetupDone:${profile.id}`,
              "true",
            );

            /*
             * Sang bước interests.
             */
            window.location.href =
              "/setup-interests";

            return updated;
          }}
        />
      </div>
    );
  }

  /*
   * ============================================================
   * NORMAL PROFILE
   * ============================================================
   */

  return (
    <div className="mx-auto max-w-5xl px-6">
      <ProfilePage
        profile={profile}

        isOwnProfile={true}
        isFollowing={false}

        postCount={0}
        followerCount={0}
        followingCount={0}

        interests={[]}
        stories={[]}

        posts={[]}
        savedPosts={[]}
      />
    </div>
  );
}