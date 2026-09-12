'use client';

import {
  MapPin,
  Search,
} from 'lucide-react';

import {
  useLocations,
} from '../hooks/use-locations';

import type {
  Location,
} from '../types/location.types';

import {
  Input,
} from '@/components/ui/input';
import { useEffect, useState } from 'react';

interface LocationPickerProps {
  value?: Location | null;

  onChange: (
    location: Location | null,
  ) => void;
}

export function LocationPicker({
  value,
  onChange,
}: LocationPickerProps) {
  const {
    locations,
    loading,
    hasNextPage,
    keyword,
    setKeyword,
    loadMore,
  } = useLocations();

  const [
    loadMoreRef,
    setLoadMoreRef,
  ] = useState<HTMLDivElement | null>(
    null,
  );

  useEffect(() => {
    if (!loadMoreRef) {
      return;
    }

    const observer =
      new IntersectionObserver(
        (entries) => {
          if (
            entries[0]?.isIntersecting &&
            hasNextPage &&
            !loading
          ) {
            loadMore();
          }
        },
        {
          rootMargin: '200px',
        },
      );

    observer.observe(loadMoreRef);

    return () => {
      observer.disconnect();
    };
  }, [
    loadMoreRef,
    hasNextPage,
    loading,
    loadMore,
  ]);

  return (
    <div className="space-y-3">
      {value && (
        <div className="flex items-center justify-between rounded-lg border p-3">
          <div className="flex min-w-0 items-center gap-2">
            <MapPin className="size-4 shrink-0" />

            <div className="min-w-0">
              <p className="truncate text-sm font-medium">
                {value.name}
              </p>

              {value.province && (
                <p className="text-xs text-muted-foreground">
                  {value.province}
                </p>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              onChange(null)
            }
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Bỏ chọn
          </button>
        </div>
      )}

      <div className="relative">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

        <Input
          value={keyword}
          onChange={(event) =>
            setKeyword(
              event.target.value,
            )
          }
          placeholder="Tìm địa điểm..."
          className="pl-9"
        />
      </div>

      <div className="max-h-64 overflow-y-auto rounded-md border">
        {locations.map(
          (location) => {
            const selected =
              value?.id ===
              location.id;

            return (
              <button
                key={location.id}
                type="button"
                onClick={() =>
                  onChange(location)
                }
                className={`flex w-full items-start gap-3 p-3 text-left hover:bg-muted ${
                  selected
                    ? 'bg-muted'
                    : ''
                }`}
              >
                <MapPin className="mt-0.5 size-4 shrink-0" />

                <div className="min-w-0">
                  <p className="font-medium">
                    {location.name}
                  </p>

                  {location.province && (
                    <p className="text-sm text-muted-foreground">
                      {location.province}
                    </p>
                  )}

                  {location.address && (
                    <p className="truncate text-xs text-muted-foreground">
                      {location.address}
                    </p>
                  )}
                </div>
              </button>
            );
          },
        )}

        <div
          ref={setLoadMoreRef}
          className="h-2"
        />

        {loading && (
          <div className="p-3 text-center text-sm text-muted-foreground">
            Đang tải...
          </div>
        )}

        {!loading &&
          locations.length === 0 && (
            <div className="p-4 text-center text-sm text-muted-foreground">
              Không tìm thấy địa điểm
            </div>
          )}

        {!loading &&
          !hasNextPage &&
          locations.length > 0 && (
            <div className="p-3 text-center text-xs text-muted-foreground">
              Đã tải hết địa điểm
            </div>
          )}
      </div>
    </div>
  );
}