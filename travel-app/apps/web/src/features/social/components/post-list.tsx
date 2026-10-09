// "use client";

// import type {Post} from "../post/types/post.types";
// import { PostCard} from "../post/components/post-card";

// interface PostListProps {
//   posts: Post[];
// }

// export function PostList({posts}: PostListProps) {
//   if (posts.length === 0) {
//     return (
//       <div className="rounded-2xl border bg-card p-8 text-center">
//         <p className="text-sm text-muted-foreground">No posts yet.</p>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       {posts.map((post) => (
//         <PostCard
//           key={post.id}
//           post={post}
//         />
//       ))}
//     </div>
//   );
// }

"use client";

import type { Post } from "../post/types/post.types";
import { PostCard } from "../post/components/post-card";

interface PostListProps {
  posts: Post[];
  loading?: boolean;
}

export function PostList({ posts, loading = false }: PostListProps) {
  if (loading) {
    return (
      <div className="rounded-2xl border bg-card p-8 text-center">
        <p className="text-sm text-muted-foreground">
          Loading posts...
        </p>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="rounded-2xl border bg-card p-8 text-center">
        <p className="text-sm text-muted-foreground">
          No posts yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
        />
      ))}
    </div>
  );
}