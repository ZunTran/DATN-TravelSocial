'use client';

import { Check, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface MetadataPickerListProps<T extends { id: string }> {
  items: T[];
  search: string;
  loading: boolean;
  hasNextPage: boolean;
  selectedId?: string;
  onSearchChange: (value: string) => void;
  onLoadMore: () => void;
  onSelect: (item: T) => void;
  getLabel: (item: T) => string;
getDescription?: (item: T) => string | null | undefined;
  placeholder?: string;
  selectedIds?: string[];
}

export function MetadataPickerList<T extends { id: string }>({ items, search, loading, hasNextPage, selectedId, onSearchChange, onLoadMore, onSelect, getLabel, getDescription, placeholder = 'Tìm kiếm...', selectedIds = [] }: MetadataPickerListProps<T>) {
  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const element = event.currentTarget;
    if (element.scrollTop + element.clientHeight >= element.scrollHeight - 30) onLoadMore();
  };

  return (
    <div className="space-y-2">
      <Input value={search} onChange={(event) => onSearchChange(event.target.value)} placeholder={placeholder} />

      <div className="max-h-64 overflow-y-auto rounded-md border" onScroll={handleScroll}>
        {items.length === 0 && !loading && <div className="p-4 text-center text-sm text-muted-foreground">Không tìm thấy dữ liệu</div>}

        {items.map(item => {
          const selected = selectedId === item.id || selectedIds.includes(item.id);

          return (
            <button key={item.id} type="button" className="flex w-full items-center justify-between gap-3 px-3 py-2 text-left hover:bg-muted" onClick={() => onSelect(item)}>
              <div className="min-w-0">
                <p className="truncate text-sm">{getLabel(item)}</p>
                {getDescription && <p className="truncate text-xs text-muted-foreground">{getDescription(item)}</p>}
              </div>
              {selected && <Check className="size-4 shrink-0" />}
            </button>
          );
        })}

        {loading && <div className="flex justify-center p-3"><Loader2 className="size-4 animate-spin" /></div>}

        {!loading && !hasNextPage && items.length > 0 && <div className="p-2 text-center text-xs text-muted-foreground">Đã hiển thị hết</div>}
      </div>
    </div>
  );
}