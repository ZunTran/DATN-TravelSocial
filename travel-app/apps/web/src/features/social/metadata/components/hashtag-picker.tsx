'use client';

import { Hash, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MetadataPickerList } from './metadata-picker-list';
import type { HashtagOption } from '../types/hashtag.types';
import { useHashtagOptions } from '../hooks/use-hashtag-options';

interface HashtagPickerProps {
  value: HashtagOption[];
  onChange: (hashtags: HashtagOption[]) => void;
  disabled?: boolean;
}

export function HashtagPicker({ value, onChange, disabled = false }: HashtagPickerProps) {
  const { opened, items, loading, hasNextPage, search, open, close, onSearchChange, loadMore } = useHashtagOptions();

  const handleToggle = (hashtag: HashtagOption) => {
    const exists = value.some(item => item.id === hashtag.id);

    if (exists) {
      onChange(value.filter(item => item.id !== hashtag.id));
      return;
    }

    if (value.length >= 10) return;

    onChange([...value, hashtag]);
  };

  return (
    <div className="relative">
      <Button type="button" variant="outline" size="sm" disabled={disabled} className="gap-2" onClick={() => opened ? close() : open()}>
        <Hash className="size-4" />
        {value.length ? `Hashtag (${value.length}/10)` : 'Hashtag'}
      </Button>

      {opened && (
        <div className="absolute left-0 top-full z-50 mt-2 w-80 rounded-md border bg-background p-3 shadow-md">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold">Chọn hashtag</p>
              <p className="text-xs text-muted-foreground">Có thể chọn tối đa 10 hashtag</p>
            </div>

            <Button type="button" variant="ghost" size="icon" className="size-7" onClick={close}>
              <X className="size-4" />
            </Button>
          </div>

          {value.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-1">
              {value.map(hashtag => (
                <button key={hashtag.id} type="button" className="rounded-full bg-muted px-2 py-1 text-xs" onClick={() => handleToggle(hashtag)}>
                  #{hashtag.name}
                </button>
              ))}
            </div>
          )}

          <MetadataPickerList items={items} search={search} loading={loading} hasNextPage={hasNextPage} onSearchChange={onSearchChange} onLoadMore={loadMore} onSelect={handleToggle} 
          selectedIds={value.map(item => item.id)} 
          getLabel={(item) => `#${item.name}`} 
          placeholder="Tìm hashtag..." />
        </div>
      )}
    </div>
  );
}