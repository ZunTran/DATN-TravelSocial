// 'use client';
// import {  Avatar,  AvatarFallback, AvatarImage,} from '@/components/ui/avatar';
// import { Button } from '@/components/ui/button';

// interface Recommendation {
//   id: string;
//   username: string;
//   avatarUrl?: string | null;
// }

// const recommendations: Recommendation[] = [
//   {
//     id: '1',
//     username: 'anna',
//   },
//   {
//     id: '2',
//     username: 'minh',
//   },
//   {
//     id: '3',
//     username: 'travel_danang',
//   },
// ];

// export function FriendRecommendation() {
//   return (
//     <section className="rounded-2xl border bg-background p-4 shadow-sm">
//       <div className="mb-4 flex items-center justify-between">
//         <h2 className="font-semibold">
//           People you may know
//         </h2>

//         <button className="text-xs font-medium text-primary">
//           See all
//         </button>
//       </div>

//       <div className="space-y-4">
//         {recommendations.map(
//           (user) => (
//             <div
//               key={user.id}
//               className="flex items-center gap-3"
//             >
//               <Avatar className="size-10">
//                 <AvatarImage
//                   src={
//                     user.avatarUrl ??
//                     undefined
//                   }
//                 />

//                 <AvatarFallback>
//                   {user.username
//                     .slice(0, 2)
//                     .toUpperCase()}
//                 </AvatarFallback>
//               </Avatar>

//               <div className="min-w-0 flex-1">
//                 <p className="truncate text-sm font-medium">
//                   {user.username}
//                 </p>

//                 <p className="text-xs text-muted-foreground">
//                   Traveler
//                 </p>
//               </div>

//               <Button
//                 size="sm"
//                 variant="outline"
//                 className="shrink-0 rounded-full"
//               >
//                 Follow
//               </Button>
//             </div>
//           ),
//         )}
//       </div>
//     </section>
//   );
// }


"use client";

import { UserPlus} from "lucide-react";
import { Avatar, AvatarFallback} from "@/components/ui/avatar";
import { Button} from "@/components/ui/button";

interface RecommendedUser {
  id: string;
  username: string;
  avatarUrl?: string | null;
  mutualFriends?: number;
}

const recommendations: RecommendedUser[] =
  [];

export function FriendRecommendation() {
  return (
    <section className="rounded-2xl border bg-card p-4">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold">People you may know</h2>
          <p className="mt-1 text-xs text-muted-foreground">Discover fellow travelers</p>
        </div>
        <Button variant="ghost" size="sm" className="text-xs"> See all</Button>
      </div>

      {recommendations.length === 0 ? (
        <div className="py-6 text-center">
          <div className="mx-auto mb-3 flex size-10 items-center justify-center rounded-full bg-muted">
            <UserPlus className="size-4 text-muted-foreground" />
          </div>

          <p className="text-xs text-muted-foreground"> No recommendations yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {recommendations.map(
            (user) => (
              <div
                key={user.id}
                className="flex items-center gap-3"
              >
                <Avatar className="size-10">
                  <AvatarFallback>
                    {user.username.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{user.username}</p>

                  {user.mutualFriends !==undefined && (
                    <p className="text-xs text-muted-foreground">
                      {user.mutualFriends}{" "}
                      mutual friends
                    </p>
                  )}
                </div>

                <Button size="sm" variant="outline">Follow</Button>
              </div>
            ),
          )}
        </div>
      )}
    </section>
  );
}
