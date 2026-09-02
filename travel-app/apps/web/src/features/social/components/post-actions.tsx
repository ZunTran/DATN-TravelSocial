// 'use client';

// import { useEffect, useState } from 'react';
// import {
//   Bookmark,
//   Heart,
//   MessageCircle,
//   Share2,
// } from 'lucide-react';

// import { Button } from '@/components/ui/button';

// import { usePostLike } from '../hooks/use-post-like';
// import { usePostSave } from '../hooks/use-post-save';

// import { useMutation } from '@apollo/client/react';
// import { SHARE_POST } from '../api/share.queries';


// interface PostActionsProps {
//   postId: string;

//   likeCount: number;
//   commentCount: number;
//   shareCount: number;
//   saveCount: number;

//   isLiked: boolean;
//   isSaved: boolean;

//   onComment?: () => void;
// }

// interface SharePostResponse {
//   sharePost: {
//     id: string;
//     postId: string;
//     userId: string;
//     createdAt: string;
//   };
// }

// export function PostActions({
//   postId,

//   likeCount,
//   commentCount,
//   shareCount,
//   saveCount,

//   isLiked: initialIsLiked,
//   isSaved: initialIsSaved,

//   onComment,
// }: PostActionsProps) {

//   // ============================================================
//   // LOCAL UI STATE
//   // ============================================================

// // const [isLiked, setIsLiked] = useState<boolean>( initialIsLiked);


//   const [isSaved, setIsSaved] = useState(initialIsSaved);

//   const [localLikeCount, setLocalLikeCount] = useState(likeCount);

//   const [localSaveCount, setLocalSaveCount] = useState(saveCount);

//   const [localShareCount, setLocalShareCount] = useState(shareCount);

//   // ============================================================
//   // SYNC SERVER -> UI
//   // ============================================================

//   // useEffect(() => {
//   //   setIsLiked(initialIsLiked);
//   // }, [initialIsLiked]);

//   useEffect(() => {
//     setIsSaved(initialIsSaved);
//   }, [initialIsSaved]);

//   useEffect(() => {
//     setLocalLikeCount(likeCount);
//   }, [likeCount]);

//   useEffect(() => {
//     setLocalSaveCount(saveCount);
//   }, [saveCount]);

//   useEffect(() => {
//     setLocalShareCount(shareCount);
//   }, [shareCount]);

//   // ============================================================
//   // HOOKS
//   // ============================================================

//   const {
//     toggleLike,
//     loading: likeLoading,
//   } = usePostLike();

//   const {
//     toggleSave,
//     loading: saveLoading,
//   } = usePostSave();

//   const [
//     sharePost,
//     { loading: shareLoading },
//   ] = useMutation<SharePostResponse>(
//     SHARE_POST,
//   );

//   // ============================================================
//   // LIKE
//   // ============================================================

//   const handleLike = async () => {
//     if (likeLoading) {
//       return;
//     }

//     const previousIsLiked = isLiked;
//     const previousLikeCount = localLikeCount;

//     const nextIsLiked = !previousIsLiked;

//     // ----------------------------------------------------------
//     // 1. UPDATE UI NGAY LẬP TỨC
//     // ----------------------------------------------------------

//     setIsLiked(nextIsLiked);

//     setLocalLikeCount(
//       nextIsLiked
//         ? previousLikeCount + 1
//         : Math.max(0, previousLikeCount - 1),
//     );

//     try {
//       // --------------------------------------------------------
//       // 2. GỌI API
//       // --------------------------------------------------------

//       await toggleLike(
//         postId,
//         previousIsLiked,
//       );

//       // --------------------------------------------------------
//       // 3. SUCCESS
//       // --------------------------------------------------------
//       //
//       // Không cần set lại state.
//       //
//       // UI đã được update optimistic ở trên.
//       //

//     } catch (error) {

//       // --------------------------------------------------------
//       // 4. API FAIL -> ROLLBACK UI
//       // --------------------------------------------------------

//       setIsLiked(previousIsLiked);

//       setLocalLikeCount( previousLikeCount, );

//       console.error( 'Failed to toggle like', error);
//     }
//   };

//   // ============================================================
//   // SAVE
//   // ============================================================

//   const handleSave = async () => {
//     if (saveLoading) {
//       return;
//     }

//     const previousIsSaved = isSaved;
//     const previousSaveCount = localSaveCount;

//     const nextIsSaved = !previousIsSaved;

//     // Optimistic UI
//     setIsSaved(nextIsSaved);

//     setLocalSaveCount(
//       nextIsSaved
//         ? previousSaveCount + 1
//         : Math.max(
//             0,
//             previousSaveCount - 1,
//           ),
//     );

//     try {

//       await toggleSave(
//         postId,
//         previousIsSaved,
//       );

//     } catch (error) {

//       // Rollback
//       setIsSaved(previousIsSaved);

//       setLocalSaveCount(
//         previousSaveCount,
//       );

//       console.error(
//         'Failed to toggle save',
//         error,
//       );
//     }
//   };

//   // ============================================================
//   // SHARE
//   // ============================================================

//   const handleShare = async () => {
//     if (shareLoading) {
//       return;
//     }

//     try {

//       await sharePost({
//         variables: {
//           postId,
//         },
//       });

//       setLocalShareCount(
//         (count) => count + 1,
//       );

//     } catch (error) {

//       console.error(
//         'Failed to share post',
//         error,
//       );
//     }
//   };

//   // ============================================================
//   // UI
//   // ============================================================

//   console.log(
//   'PostActions:',
//   postId,
//   'initialIsLiked:',
//   initialIsLiked,
//   'local isLiked:',
//   isLiked,
// );

//   return (
    
//     <div className="border-t">

//       <div className="flex items-center justify-between px-4 py-2 text-xs text-muted-foreground">

//         <span>
//           {localLikeCount} likes
//         </span>

//         <div className="flex gap-3">

//           <span>
//             {commentCount} comments
//           </span>

//           <span>
//             {localShareCount} shares
//           </span>

//           {localSaveCount > 0 && (
//             <span>
//               {localSaveCount} saves
//             </span>
//           )}

//         </div>

//       </div>

//       <div className="grid grid-cols-4 px-2 pb-1">

//         {/* ================================================== */}
//         {/* LIKE */}
//         {/* ================================================== */}

//         <Button
//           type="button"
//           variant="ghost"
//           size="sm"
//           disabled={likeLoading}
//           onClick={handleLike}
//           className={
//             isLiked
//               ? 'gap-2 text-red-500 hover:text-red-600'
//               : 'gap-2'
//           }
//         >

//           <Heart
//             className="size-4"
//             fill={isLiked ? 'currentColor': 'none'}
//           />

//           <span className="hidden sm:inline">
//             Like
//           </span>

//         </Button>

//         {/* ================================================== */}
//         {/* COMMENT */}
//         {/* ================================================== */}

//         <Button
//           type="button"
//           variant="ghost"
//           size="sm"
//           onClick={onComment}
//           className="gap-2"
//         >

//           <MessageCircle className="size-4" />

//           <span className="hidden sm:inline">
//             Comment
//           </span>

//         </Button>

//         {/* ================================================== */}
//         {/* SHARE */}
//         {/* ================================================== */}

//         <Button
//           type="button"
//           variant="ghost"
//           size="sm"
//           disabled={shareLoading}
//           onClick={handleShare}
//           className="gap-2"
//         >

//           <Share2 className="size-4" />

//           <span className="hidden sm:inline">
//             Share
//           </span>

//         </Button>

//         {/* ================================================== */}
//         {/* SAVE */}
//         {/* ================================================== */}

//         <Button
//           type="button"
//           variant="ghost"
//           size="sm"
//           disabled={saveLoading}
//           onClick={handleSave}
//           className={
//             isSaved
//               ? 'gap-2 text-primary'
//               : 'gap-2'
//           }
//         >

//           <Bookmark
//             className="size-4"
//             fill={
//               isSaved
//                 ? 'currentColor'
//                 : 'none'
//             }
//           />

//           <span className="hidden sm:inline">
//             Save
//           </span>

//         </Button>

//       </div>

//     </div>
//   );
// }

'use client';

import { useState } from 'react';

import {
  Bookmark,
  Heart,
  MessageCircle,
  Share2,
} from 'lucide-react';

import { Button } from '@/components/ui/button';

import { usePostLike } from '../hooks/use-post-like';
import { usePostSave } from '../hooks/use-post-save';

import { useMutation } from '@apollo/client/react';
import { SHARE_POST } from '../api/share.queries';

interface PostActionsProps {
  postId: string;

  likeCount: number;
  commentCount: number;
  shareCount: number;
  saveCount: number;

  isLiked: boolean;
  isSaved: boolean;

  onLikeChange?: (
    isLiked: boolean,
    likeCount: number,
  ) => void;

  onComment?: () => void;
}

interface SharePostResponse {
  sharePost: {
    id: string;
    postId: string;
    userId: string;
    createdAt: string;
  };
}

export function PostActions({
  postId,
  likeCount,
  commentCount,
  shareCount,
  saveCount,
  isLiked,
  isSaved,
  onLikeChange,
  onComment,
}: PostActionsProps) {
  const {
    toggleLike,
    loading: likeLoading,
  } = usePostLike();

  const {
    toggleSave,
    loading: saveLoading,
  } = usePostSave();

  const [
    sharePost,
    { loading: shareLoading },
  ] = useMutation<SharePostResponse>(
    SHARE_POST,
  );

  const [localSaveCount, setLocalSaveCount] =
    useState(saveCount);

  const [localShareCount, setLocalShareCount] =
    useState(shareCount);

  const handleLike = async () => {
    if (likeLoading) {
      return;
    }

    const nextIsLiked = !isLiked;

    const nextLikeCount = nextIsLiked
      ? likeCount + 1
      : Math.max(0, likeCount - 1);

    // ==========================================
    // OPTIMISTIC UI
    // ==========================================

    onLikeChange?.(
      nextIsLiked,
      nextLikeCount,
    );

    try {
      await toggleLike(
        postId,
        isLiked,
      );

    } catch (error) {
      // ========================================
      // API FAIL -> ROLLBACK
      // ========================================

      onLikeChange?.(
        isLiked,
        likeCount,
      );

      console.error(
        'Failed to toggle like',
        error,
      );
    }
  };

  const handleSave = async () => {
    if (saveLoading) {
      return;
    }

    const nextIsSaved = !isSaved;

    const nextSaveCount = nextIsSaved
      ? localSaveCount + 1
      : Math.max(0, localSaveCount - 1);

    setLocalSaveCount(nextSaveCount);

    try {
      await toggleSave(
        postId,
        isSaved,
      );
    } catch (error) {
      setLocalSaveCount(saveCount);

      console.error(
        'Failed to toggle save',
        error,
      );
    }
  };

  const handleShare = async () => {
    if (shareLoading) {
      return;
    }

    try {
      await sharePost({
        variables: {
          postId,
        },
      });

      setLocalShareCount(
        (count) => count + 1,
      );
    } catch (error) {
      console.error(
        'Failed to share post',
        error,
      );
    }
  };

  return (
    <div className="border-t">
      <div className="flex items-center justify-between px-4 py-2 text-xs text-muted-foreground">
        <span>
          {likeCount} likes
        </span>

        <div className="flex gap-3">
          <span>
            {commentCount} comments
          </span>

          <span>
            {localShareCount} shares
          </span>

          {localSaveCount > 0 && (
            <span>
              {localSaveCount} saves
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-4 px-2 pb-1">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={likeLoading}
          onClick={handleLike}
          className={
            isLiked
              ? 'gap-2 text-red-500 hover:text-red-600'
              : 'gap-2'
          }
        >
          <Heart
            className="size-4"
            fill={
              isLiked
                ? 'currentColor'
                : 'none'
            }
          />

          <span className="hidden sm:inline">
            Like
          </span>
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onComment}
          className="gap-2"
        >
          <MessageCircle className="size-4" />

          <span className="hidden sm:inline">
            Comment
          </span>
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={shareLoading}
          onClick={handleShare}
          className="gap-2"
        >
          <Share2 className="size-4" />

          <span className="hidden sm:inline">
            Share
          </span>
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={saveLoading}
          onClick={handleSave}
          className={
            isSaved
              ? 'gap-2 text-primary'
              : 'gap-2'
          }
        >
          <Bookmark
            className="size-4"
            fill={
              isSaved
                ? 'currentColor'
                : 'none'
            }
          />

          <span className="hidden sm:inline">
            Save
          </span>
        </Button>
      </div>
    </div>
  );
}

