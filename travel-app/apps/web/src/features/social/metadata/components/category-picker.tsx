'use client';

import { Tag, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MetadataPickerList } from './metadata-picker-list';
import type { CategoryOption } from '../types/category.types';
import { useCategoryOptions } from '../hooks/use-category-options';

interface CategoryPickerProps {
  value: CategoryOption | null;
  onChange: (category: CategoryOption | null) => void;
  disabled?: boolean;
}

export function CategoryPicker({ value, onChange, disabled = false }: CategoryPickerProps) {
  const { opened, items, loading, hasNextPage, search, open, close, onSearchChange, loadMore } = useCategoryOptions();

  return (
    <div className="relative">
      <Button type="button" variant="outline" size="sm" disabled={disabled} className="gap-2" onClick={() => opened ? close() : open()}>
        <Tag className="size-4" />
        {value ? value.name : 'Danh mục'}
      </Button>

      {opened && (
        <div className="absolute left-0 top-full z-50 mt-2 w-80 rounded-md border bg-background p-3 shadow-md">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold">Chọn danh mục</p>
              <p className="text-xs text-muted-foreground">Tìm kiếm danh mục cho bài viết</p>
            </div>

            {value && (
              <Button type="button" variant="ghost" size="icon" className="size-7" onClick={() => onChange(null)}>
                <X className="size-4" />
              </Button>
            )}
          </div>

          <MetadataPickerList items={items} search={search} 
          loading={loading} hasNextPage={hasNextPage} 
          onSearchChange={onSearchChange} 
          onLoadMore={loadMore} 
          onSelect={(category) => { onChange(category); 
          close(); }} selectedId={value?.id} 
          getLabel={(item) => item.name} 
          getDescription={(item) => item.description} 
          placeholder="Tìm danh mục..." />
        </div>
      )}
    </div>
  );
}