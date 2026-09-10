'use client';
import { AlertTriangle} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

import type {
  AdminHashtag,
} from '../types/hashtag.types';

interface Props {
  open: boolean;
  hashtag?: AdminHashtag | null;
  loading?: boolean;

  onOpenChange: (
    open: boolean,
  ) => void;

  onConfirm: () => Promise<void>;
}

export function HashtagDeleteDialog({
  open,
  hashtag,
  loading = false,
  onOpenChange,
  onConfirm,
}: Props) {
  if (!hashtag) {
    return null;
  }

  const inUse =
    hashtag.postCount > 0;

  return (
    <AlertDialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Delete hashtag?
          </AlertDialogTitle>

          <AlertDialogDescription>
            Are you sure you want to delete
            <strong>
              {' '}
              #{hashtag.name}
            </strong>
            ?
          </AlertDialogDescription>
        </AlertDialogHeader>

        {inUse && (
          <Alert>
            <AlertTriangle />

            <AlertDescription>
              This hashtag is currently used
              by {hashtag.postCount} post(s).
              You cannot delete it until it
              is no longer used.
            </AlertDescription>
          </Alert>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel>
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            disabled={
              loading || inUse
            }
            onClick={async (e) => {
              e.preventDefault();
              await onConfirm();
            }}
            className="bg-destructive text-destructive-foreground"
          >
            {loading
              ? 'Deleting...'
              : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}