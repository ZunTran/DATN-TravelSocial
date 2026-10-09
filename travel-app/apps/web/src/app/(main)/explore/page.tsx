// 'use client';

// import {
//   useSearchParams,
// } from 'next/navigation';

// import {
//   ExploreUsers,
// } from '@/features/explore/components/explore-users';

// import {
//   ExplorePosts,
// } from '@/features/explore/components/explore-posts';

// export default function ExplorePage() {
//   const searchParams = useSearchParams();

//   const keyword =
//     searchParams.get('keyword')?.trim() ?? '';

//   return (
//     <main className="mx-auto w-full max-w-2xl px-4 py-6">
//       <h1 className="mb-6 text-2xl font-bold">
//         Explore
//       </h1>

//       {!keyword ? (
//         <p className="text-muted-foreground">
//           Search for people or posts.
//         </p>
//       ) : (
//         <div className="space-y-10">
//           <ExploreUsers keyword={keyword} />

//           <ExplorePosts keyword={keyword} />
//         </div>
//       )}
//     </main>
//   );
// }
import { Suspense } from 'react';
import ExploreContent from './explore-content';

export default function ExplorePage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto w-full max-w-2xl px-4 py-6">
          <h1 className="mb-6 text-2xl font-bold">
            Explore
          </h1>

          <p className="text-muted-foreground">
            Loading...
          </p>
        </main>
      }
    >
      <ExploreContent />
    </Suspense>
  );
}