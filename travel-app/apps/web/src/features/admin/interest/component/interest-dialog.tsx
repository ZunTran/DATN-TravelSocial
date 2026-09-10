'use client';

import {
  useEffect,
  useState,
} from 'react';

import {
  ImagePlus,
} from 'lucide-react';

import {
  Button,
} from '@/components/ui/button';

import {
  Input,
} from '@/components/ui/input';

import {
  Label,
} from '@/components/ui/label';

import type {
  AdminInterest,
} from '../types/interest.types';

interface InterestDialogProps {
  open: boolean;

  interest?: AdminInterest | null;

  loading?: boolean;

  onClose: () => void;

  onSubmit: (
    name: string,
    icon?: File | null,
  ) => Promise<void>;
}

export function InterestDialog({
  open,
  interest,
  loading = false,
  onClose,
  onSubmit,
}: InterestDialogProps) {
  const [
    name,
    setName,
  ] = useState('');

  const [
    icon,
    setIcon,
  ] = useState<File | null>(
    null,
  );

  const [
    preview,
    setPreview,
  ] = useState<
    string | null
  >(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    setName(
      interest?.name ?? '',
    );

    setIcon(null);

    setPreview(
      interest?.icon_url ?? null,
    );
  }, [
    open,
    interest,
  ]);

  if (!open) {
    return null;
  }

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    setIcon(file);

    setPreview(
      URL.createObjectURL(file),
    );
  };

  const handleSubmit = async (
    event: React.FormEvent,
  ) => {
    event.preventDefault();

    const trimmed =
      name.trim();

    if (!trimmed) {
      return;
    }

    await onSubmit(
      trimmed,
      icon,
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-md rounded-xl bg-background p-6 shadow-xl">
        <div className="mb-5">
          <h2 className="text-xl font-semibold">
            {interest
              ? 'Chỉnh sửa Interest'
              : 'Thêm Interest'}
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            {interest
              ? 'Cập nhật thông tin interest'
              : 'Tạo interest mới cho hệ thống'}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <div className="space-y-2">
            <Label>
              Tên Interest
            </Label>

            <Input
              value={name}
              onChange={(e) =>
                setName(
                  e.target.value,
                )
              }
              placeholder="Ví dụ: Beach"
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label>
              Icon
            </Label>

            <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed p-6 hover:bg-muted/50">
              {preview ? (
                <img
                  src={preview}
                  alt="Interest icon"
                  className="mb-3 h-20 w-20 rounded-lg object-cover"
                />
              ) : (
                <ImagePlus className="mb-3 h-8 w-8 text-muted-foreground" />
              )}

              <span className="text-sm text-muted-foreground">
                Chọn icon
              </span>

              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={
                  handleFileChange
                }
                disabled={loading}
              />
            </label>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Hủy
            </Button>

            <Button
              type="submit"
              disabled={
                loading ||
                !name.trim()
              }
            >
              {loading
                ? 'Đang lưu...'
                : interest
                  ? 'Lưu thay đổi'
                  : 'Thêm Interest'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}