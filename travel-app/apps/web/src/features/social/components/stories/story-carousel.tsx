// 'use client';
// import { Plus } from 'lucide-react';
// import {  Avatar,  AvatarFallback,  AvatarImage,} from '@/components/ui/avatar';

// interface Story {
//   id: string;
//   username: string;
//   avatarUrl?: string | null;
//   mediaUrl?: string | null;
//   isOwn?: boolean;
// }

// const demoStories: Story[] = [
//   {
//     id: 'own',
//     username: 'Your story',
//     isOwn: true,
//   },
//   {
//     id: '1',
//     username: 'anna',
//     avatarUrl: null,
//   },
//   {
//     id: '2',
//     username: 'minh',
//     avatarUrl: null,
//   },
//   {
//     id: '3',
//     username: 'travel',
//     avatarUrl: null,
//   },
//   {
//     id: '4',
//     username: 'linh',
//     avatarUrl: null,
//   },
// ];

// export function StoryCarousel() {
//   return (
//     <section className="rounded-2xl border bg-background p-4 shadow-sm">
//       <div className="mb-3 flex items-center justify-between">
//         <h2 className="font-semibold">
//           Stories
//         </h2>

//         <button className="text-sm font-medium text-primary hover:underline">
//           See all
//         </button>
//       </div>

//       <div className="flex gap-4 overflow-x-auto pb-1">
//         {demoStories.map((story) => (
//           <button
//             key={story.id}
//             type="button"
//             className="flex w-16 shrink-0 flex-col items-center gap-1.5"
//           >
//             <div className="relative">
//               <Avatar className="size-16 border-2 border-primary p-0.5">
//                 <AvatarImage
//                   src={
//                     story.avatarUrl ??
//                     undefined
//                   }
//                   alt={story.username}
//                 />

//                 <AvatarFallback>
//                   {story.username
//                     .slice(0, 2)
//                     .toUpperCase()}
//                 </AvatarFallback>
//               </Avatar>

//               {story.isOwn && (
//                 <span className="absolute bottom-0 right-0 flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
//                   <Plus className="size-3" />
//                 </span>
//               )}
//             </div>

//             <span className="w-full truncate text-center text-xs">
//               {story.username}
//             </span>
//           </button>
//         ))}
//       </div>
//     </section>
//   );
// }



"use client";

import { Plus} from "lucide-react";
import { Button} from "@/components/ui/button";

export function StoryCarousel() {
  return (
    <div className="rounded-2xl border bg-card p-4">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold"> Stories </h2>

          <p className="text-xs text-muted-foreground"> Share your latest adventure  </p>
        </div>

        <Button variant="ghost" size="sm" className="text-xs"> View all </Button>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-1">
        <button type="button"
          className="flex w-20 shrink-0 flex-col items-center gap-2"
        >
          <div className="flex size-16 items-center justify-center rounded-full border-2 border-dashed bg-muted">
            <Plus className="size-5 text-muted-foreground" />
          </div>

          <span className="text-xs font-medium"> Your story </span>
        </button>

        <div className="flex flex-1 items-center justify-center text-xs text-muted-foreground"> No stories yet </div>
      </div>
    </div>
  );
}


