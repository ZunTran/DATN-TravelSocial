'use client';

import { MapPin, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MetadataPickerList } from './metadata-picker-list';
import type { LocationOption } from '../types/location.types';
import { useLocationOptions } from '../hooks/use-location-options';

interface LocationPickerProps {
  value: LocationOption | null;
  onChange: (location: LocationOption | null) => void;
  disabled?: boolean;
}

export function LocationPicker({ value, onChange, disabled = false }: LocationPickerProps) {
  const { opened, items, loading, hasNextPage, search, open, close, onSearchChange, loadMore } = useLocationOptions();

  const handleSelect = (location: LocationOption) => {
    onChange(location);
    close();
  };

  return (
    <div className="relative">
      <Button type="button" variant="outline" size="sm" disabled={disabled} className="max-w-52 gap-2" onClick={() => opened ? close() : open()}>
        <MapPin className="size-4 shrink-0" />
        <span className="truncate">{value ? value.name : 'Địa điểm'}</span>
      </Button>

      {opened && (
        <div className="absolute left-0 top-full z-50 mt-2 w-96 rounded-md border bg-background p-3 shadow-md">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold">Chọn địa điểm</p>
              <p className="text-xs text-muted-foreground">Tìm địa điểm để gắn vào bài viết</p>
            </div>

            {value && (
              <Button type="button" variant="ghost" size="icon" className="size-7" onClick={() => onChange(null)}>
                <X className="size-4" />
              </Button>
            )}
          </div>

          <MetadataPickerList items={items} search={search} loading={loading} hasNextPage={hasNextPage} onSearchChange={onSearchChange} onLoadMore={loadMore} onSelect={handleSelect} selectedId={value?.id} getLabel={(item) => item.name} getDescription={(item) => [item.address, item.province].filter(Boolean).join(' · ')} placeholder="Tìm địa điểm..." />
        </div>
      )}
    </div>
  );
}