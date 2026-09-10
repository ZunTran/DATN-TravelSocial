'use client';

import { useEffect, useState } from 'react';

import type {
  AdminCategory,
} from '../types/category.types';

interface CategoryDialogProps {
  open: boolean;
  category?: AdminCategory | null;
  loading?: boolean;

  onOpenChange: (open: boolean) => void;

  onSubmit: (
    name: string,
    description: string,
  ) => Promise<void>;
}

export function CategoryDialog({
  open,
  category,
  loading = false,
  onOpenChange,
  onSubmit,
}: CategoryDialogProps) {
  const [name, setName] = useState('');
  const [description, setDescription] =
    useState('');

  useEffect(() => {
    if (!open) return;

    setName(category?.name ?? '');
    setDescription(
      category?.description ?? '',
    );
  }, [open, category]);

  if (!open) return null;

  const editing = !!category;

  const handleSubmit = async (
    event: React.FormEvent,
  ) => {
    event.preventDefault();

    const trimmedName = name.trim();

    if (!trimmedName) {
      return;
    }

    await onSubmit(
      trimmedName,
      description.trim(),
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <div className="mb-5">
          <h2 className="text-lg font-semibold">
            {editing
              ? 'Edit category'
              : 'Create category'}
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            {editing
              ? 'Update category information.'
              : 'Create a new travel category.'}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <div>
            <label className="mb-1 block text-sm font-medium">
              Name
            </label>

            <input
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              maxLength={100}
              placeholder="Adventure"
              className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Description
            </label>

            <textarea
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              maxLength={500}
              rows={4}
              placeholder="Travel category description..."
              className="w-full resize-none rounded-lg border px-3 py-2 outline-none focus:ring-2"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() =>
                onOpenChange(false)
              }
              className="rounded-lg border px-4 py-2 text-sm"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={
                loading ||
                !name.trim()
              }
              className="rounded-lg bg-black px-4 py-2 text-sm text-white disabled:opacity-50"
            >
              {loading
                ? 'Saving...'
                : editing
                  ? 'Update'
                  : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}