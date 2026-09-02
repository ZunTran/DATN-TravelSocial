'use client';

import {
  useEffect,
  useRef,
} from 'react';

interface LoadMoreTriggerProps {
  enabled: boolean;
  loading?: boolean;
  onLoadMore: () => void;
}

export default function LoadMoreTrigger({
  enabled,
  loading = false,
  onLoadMore,
}: LoadMoreTriggerProps) {
  const ref =
    useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!enabled || loading) {
      return;
    }

    const element = ref.current;

    if (!element) {
      return;
    }

    const observer =
      new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            onLoadMore();
          }
        },
        {
          rootMargin:
            '0px 0px 30% 0px',
        },
      );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [
    enabled,
    loading,
    onLoadMore,
  ]);

  return (
    <div
      ref={ref}
      className="h-10"
      aria-hidden="true"
    />
  );
}