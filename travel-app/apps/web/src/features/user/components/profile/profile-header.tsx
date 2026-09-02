// 'use client';

// import Image from 'next/image';
// import { Camera, Pencil } from 'lucide-react';

// import {
//   Avatar,
//   AvatarFallback,
//   AvatarImage,
// } from '@/components/ui/avatar';

// import { Button } from '@/components/ui/button';

// import type { UserProfile } from '../../types/profile';

// interface ProfileHeaderProps {
//   profile: UserProfile;

//   isOwnProfile?: boolean;
//   isFollowing?: boolean;

//   onFollow?: () => void;
//   onEdit?: () => void;
//   onEditAvatar?: () => void;
//   onEditCover?: () => void;
// }

// export default function ProfileHeader({
//   profile,
//   isOwnProfile = true,
//   isFollowing = false,
//   onFollow,
//   onEdit,
//   onEditAvatar,
//   onEditCover,
// }: ProfileHeaderProps) {
//   const {
//     username,
//     display_name,
//     bio,
//     avatar_url,
//     cover_url,
//   } = profile;

//   const displayName = display_name || username || 'User';

//   const initials = displayName
//     .slice(0, 2)
//     .toUpperCase();

//   return (
//     <section className="overflow-hidden rounded-2xl border bg-card shadow-sm">
//       {/* COVER */}
//       <div className="relative h-48 w-full bg-muted sm:h-60">
//         {cover_url ? (
//           <Image
//             src={cover_url}
//             alt="Profile cover"
//             fill
//             priority
//             className="object-cover"
//           />
//         ) : (
//           <div className="h-full w-full bg-gradient-to-br from-muted via-muted/70 to-background" />
//         )}

//         {isOwnProfile && (
//           <Button
//             type="button"
//             size="icon"
//             variant="secondary"
//             className="absolute right-4 top-4 h-9 w-9 rounded-full shadow-md"
//             onClick={onEditCover}
//             aria-label="Change cover photo"
//           >
//             <Camera className="h-4 w-4" />
//           </Button>
//         )}
//       </div>

//       {/* PROFILE BODY */}
//       <div className="relative px-5 pb-6 sm:px-8">
//         {/* AVATAR */}
//         <div className="-mt-16 flex items-end justify-between">
//           <div className="relative">
//             <Avatar className="h-32 w-32 border-4 border-card shadow-lg sm:h-36 sm:w-36">
//               <AvatarImage
//                 src={avatar_url ?? undefined}
//                 alt={displayName}
//                 className="object-cover"
//               />

//               <AvatarFallback className="text-2xl font-semibold">
//                 {initials}
//               </AvatarFallback>
//             </Avatar>

//             {isOwnProfile && (
//               <Button
//                 type="button"
//                 size="icon"
//                 variant="secondary"
//                 className="absolute bottom-1 right-1 h-9 w-9 rounded-full border-2 border-card shadow-md"
//                 onClick={onEditAvatar}
//                 aria-label="Change avatar"
//               >
//                 <Pencil className="h-4 w-4" />
//               </Button>
//             )}
//           </div>
//         </div>

//         {/* INFO */}
//         <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
//           <div className="min-w-0">
//             <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
//               {displayName}
//             </h1>

//             <p className="mt-1 text-sm text-muted-foreground">
//               @{username}
//             </p>

//             {bio && (
//               <p className="mt-4 max-w-2xl text-sm leading-6 text-foreground/80">
//                 {bio}
//               </p>
//             )}
//           </div>

//           {/* ACTION */}
//           <div className="shrink-0">
//             {isOwnProfile ? (
//               <Button
//                 variant="outline"
//                 className="rounded-full px-5"
//                 onClick={onEdit}
//               >
//                 <Pencil className="mr-2 h-4 w-4" />
//                 Edit profile
//               </Button>
//             ) : (
//               <Button
//                 className="rounded-full px-5"
//                 onClick={onFollow}
//               >
//                 {isFollowing ? 'Following' : 'Follow'}
//               </Button>
//             )}
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

'use client';

import Image from 'next/image';
import { Camera, Pencil } from 'lucide-react';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';

import { Button } from '@/components/ui/button';

import type { UserProfile } from '../../types/profile';

interface ProfileHeaderProps {
  profile: UserProfile;

  isOwnProfile?: boolean;
  isFollowing?: boolean;

  onFollow?: () => void;
  onEditAvatar?: () => void;
  onEditCover?: () => void;
}

export default function ProfileHeader({
  profile,
  isOwnProfile = true,
  isFollowing = false,
  onFollow,
  onEditAvatar,
  onEditCover,
}: ProfileHeaderProps) {
  const {
    username,
    display_name,
    bio,
    avatar_url,
    cover_url,
  } = profile;

  const displayName =
    display_name || username || 'User';

  const initials = displayName
    .slice(0, 2)
    .toUpperCase();

  return (
    <section className="overflow-hidden rounded-2xl border bg-card shadow-sm">

      {/* COVER */}
      <div className="relative h-48 w-full bg-muted sm:h-60">
        {cover_url ? (
          <Image
            src={cover_url}
            alt="Profile cover"
            fill
            priority
            className="object-cover"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-muted via-muted/70 to-background" />
        )}

        {isOwnProfile && (
          <Button
            type="button"
            size="icon"
            variant="secondary"
            className="absolute right-4 top-4 h-9 w-9 rounded-full shadow-md"
            onClick={onEditCover}
            aria-label="Change cover photo"
          >
            <Camera className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* PROFILE BODY */}
      <div className="relative px-5 pb-6 sm:px-8">

        {/* AVATAR */}
        <div className="-mt-16 flex items-end justify-between">
          <div className="relative">

            <Avatar className="h-32 w-32 border-4 border-card shadow-lg sm:h-36 sm:w-36">
              <AvatarImage
                src={avatar_url ?? undefined}
                alt={displayName}
                className="object-cover"
              />

              <AvatarFallback className="text-2xl font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>

            {isOwnProfile && (
              <Button
                type="button"
                size="icon"
                variant="secondary"
                className="absolute bottom-1 right-1 h-9 w-9 rounded-full border-2 border-card shadow-md"
                onClick={onEditAvatar}
                aria-label="Change avatar"
              >
                <Pencil className="h-4 w-4" />
              </Button>
            )}

          </div>
        </div>

        {/* INFO */}
        <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">

          <div className="min-w-0">

            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {displayName}
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              @{username}
            </p>

            {bio && (
              <p className="mt-4 max-w-2xl text-sm leading-6 text-foreground/80">
                {bio}
              </p>
            )}

          </div>

          {/* FOLLOW */}
          {!isOwnProfile && (
            <div className="shrink-0">
              <Button
                className="rounded-full px-5"
                onClick={onFollow}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </Button>
            </div>
          )}

        </div>
      </div>
    </section>
  );
}