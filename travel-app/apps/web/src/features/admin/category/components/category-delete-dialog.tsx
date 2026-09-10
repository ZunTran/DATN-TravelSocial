'use client';

import type {
  AdminCategory,
} from '../types/category.types';

interface CategoryDeleteDialogProps {
  open: boolean;
  category?: AdminCategory | null;
  loading?: boolean;

  onOpenChange: (
    open: boolean,
  ) => void;

  onConfirm: () => Promise<void>;
}

export function CategoryDeleteDialog({
  open,
  category,
  loading = false,
  onOpenChange,
  onConfirm,
}: CategoryDeleteDialogProps) {
  if (!open || !category) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <h2 className="text-lg font-semibold">
          Delete category?
        </h2>

        <p className="mt-2 text-sm text-gray-600">
          Are you sure you want to delete{' '}
          <strong>
            {category.name}
          </strong>
          ?
        </p>

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={() =>
              onOpenChange(false)
            }
            className="rounded-lg border px-4 py-2"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={onConfirm}
            className="rounded-lg bg-red-600 px-4 py-2 text-white disabled:opacity-50"
          >
            {loading
              ? 'Deleting...'
              : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}