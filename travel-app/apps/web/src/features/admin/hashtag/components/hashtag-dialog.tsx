'use client';

import {
  useEffect,
  useState,
} from 'react';

import {
  Button,
} from '@/components/ui/button';

import {
  Input,
} from '@/components/ui/input';

import {
  Label,
} from '@/components/ui/label';

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import type {
  AdminHashtag,
} from '../types/hashtag.types';

interface HashtagDialogProps {
  open: boolean;
  hashtag?: AdminHashtag | null;
  loading?: boolean;

  onOpenChange: (
    open: boolean,
  ) => void;

  onSubmit: (
    name: string,
  ) => Promise<void>;
}

export function HashtagDialog({
  open,
  hashtag,
  loading = false,
  onOpenChange,
  onSubmit,
}: HashtagDialogProps) {
  const [name, setName] =
    useState('');

  useEffect(() => {
    setName(
      hashtag?.name ?? '',
    );
  }, [hashtag, open]);

  const handleSubmit = async (
    e: React.FormEvent,
  ) => {
    e.preventDefault();

    if (!name.trim()) {
      return;
    }

    await onSubmit(
      name.trim(),
    );
  };

  const editing =
    Boolean(hashtag);

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent>
        <form
          onSubmit={handleSubmit}
        >
          <DialogHeader>
            <DialogTitle>
              {editing
                ? 'Edit hashtag'
                : 'Create hashtag'}
            </DialogTitle>
          </DialogHeader>

          <div className="py-6">
            <Label htmlFor="hashtag-name">
              Name
            </Label>

            <Input
              id="hashtag-name"
              value={name}
              onChange={(e) =>
                setName(
                  e.target.value,
                )
              }
              placeholder="danang"
              maxLength={100}
              className="mt-2"
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                onOpenChange(false)
              }
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={
                loading ||
                !name.trim()
              }
            >
              {loading
                ? 'Saving...'
                : editing
                  ? 'Save changes'
                  : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}