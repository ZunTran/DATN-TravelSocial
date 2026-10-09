// 'use client';

// import {
//   useSearchParams,
// } from 'next/navigation';

// import {
//   ExploreUsers,
// } from '@/features/explore/components/explore-users';

// export default function ExploreUsersPage() {
//   const searchParams = useSearchParams();

//   const keyword =
//     searchParams.get('keyword')?.trim() ?? '';

//   return (
//     <main className="mx-auto w-full max-w-2xl px-4 py-6">
//       <h1 className="mb-6 text-2xl font-bold">
//         People
//       </h1>

//       {!keyword ? (
//         <p className="text-muted-foreground">
//           Enter a keyword to search users.
//         </p>
//       ) : (
//         <ExploreUsers
//           keyword={keyword}
//           fullPage
//         />
//       )}
//     </main>
//   );
// }

import { Suspense } from 'react';

import ExploreUsersSearch from './explore-users-search';

export default function ExploreUsersPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto w-full max-w-2xl px-4 py-6">
          <h1 className="mb-6 text-2xl font-bold">
            People
          </h1>

          <p className="text-muted-foreground">
            Loading...
          </p>
        </main>
      }
    >
      <ExploreUsersSearch />
    </Suspense>
  );
}