'use client';

import { PostDetail } from '@/features/social/interactons/components/post-detail';
import { useParams } from 'next/navigation';


export default function PostDetailPage() {
  const params = useParams<{ id: string }>();

  const postId = params.id;

  if (!postId) {
    return null;
  }

  return <PostDetail postId={postId} />;
}