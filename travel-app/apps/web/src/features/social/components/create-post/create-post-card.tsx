// 'use client';
// import {  Image as ImageIcon, MapPin, video,} from 'lucide-react';
// import {  Avatar, AvatarFallback,} from '@/components/ui/avatar';
// import { Button } from '@/components/ui/button';

// export function CreatePostCard() {
//   return (
//     <section className="rounded-2xl border bg-background p-4 shadow-sm">
//       <div className="flex gap-3">
//         <Avatar className="size-10">
//           <AvatarFallback>
//             U
//           </AvatarFallback>
//         </Avatar>

//         <button
//           type="button"
//           className="flex h-10 flex-1 items-center rounded-full bg-muted px-4 text-left text-sm text-muted-foreground transition hover:bg-muted/70"
//         >
//           What's on your mind?
//         </button>
//       </div>

//       <div className="mt-4 flex flex-wrap items-center gap-2 border-t pt-3">
//         <Button
//           variant="ghost"
//           size="sm"
//           className="flex-1"
//         >
//           <ImageIcon className="mr-2 size-4" />
//           Photo
//         </Button>

//         <Button
//           variant="ghost"
//           size="sm"
//           className="flex-1"
//         >
//           <Video className="mr-2 size-4" />
//           Video
//         </Button>

//         <Button
//           variant="ghost"
//           size="sm"
//           className="flex-1"
//         >
//           <MapPin className="mr-2 size-4" />
//           Location
//         </Button>
//       </div>
//     </section>
//   );
// }

"use client";

import { Image as ImageIcon, MapPin, Smile, Video} from "lucide-react";
import { Avatar, AvatarFallback,} from "@/components/ui/avatar";
import { Button} from "@/components/ui/button";

export function CreatePostCard() {
  return (
    <section className="rounded-2xl border bg-card p-4 shadow-sm">
      <div className="flex gap-3">
        <Avatar className="size-11">
          <AvatarFallback>
            ME
          </AvatarFallback>
        </Avatar>

        <button type="button"
          className="flex h-11 flex-1 items-center rounded-full bg-muted px-4 text-left text-sm text-muted-foreground transition-colors hover:bg-muted/80"
        > What&apos;s on your mind?
        </button>
      </div>

      <div className="mt-4 border-t pt-3">
        <div className="grid grid-cols-3 gap-1">
          <Button variant="ghost" size="sm" className="gap-2">
            <ImageIcon className="size-4 text-green-500" />

            <span className="hidden sm:inline"> Photo </span>
          </Button>

          <Button variant="ghost" size="sm" className="gap-2">
            <Video className="size-4 text-red-500" />
            <span className="hidden sm:inline">Video</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="gap-2"
          >
            <MapPin className="size-4 text-primary" />

            <span className="hidden sm:inline">
              Location
            </span>
          </Button>
        </div>
      </div>
    </section>
  );
}
