'use client';

import type {Location} from '@/features/admin/location/types/location.types';

interface LocationDeleteDialogProps {
  location?: Location | null;
  loading?: boolean;
  onCancel: () => void;
  onConfirm: () => Promise<void>;
}

export function LocationDeleteDialog({
  location,
  loading,
  onCancel,
  onConfirm,
}: LocationDeleteDialogProps) {
  if (!location) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg bg-background p-6 shadow-lg">
        <h2 className="text-lg font-semibold">Delete Location</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Are you sure you want to delete{' '}
          <strong>{location.name}</strong>?
        </p>

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md border px-4 py-2"
          >Cancel</button>

          <button
            type="button"
            disabled={loading}
            onClick={onConfirm}
            className="rounded-md bg-destructive px-4 py-2 text-destructive-foreground"
          >
            {loading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}