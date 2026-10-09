'use client';

import {
  FormEvent,
  useState,
} from 'react';

import {
  Loader2,
  Send,
} from 'lucide-react';

import {
  Button,
} from '@/components/ui/button';

import {
  Textarea,
} from '@/components/ui/textarea';

interface CommentInputProps {
  onSubmit: (
    content: string,
  ) => Promise<void>;

  loading?: boolean;

  placeholder?: string;
}

export function CommentInput({
  onSubmit,
  loading = false,
  placeholder = 'Viết bình luận...',
}: CommentInputProps) {
  const [
    content,
    setContent,
  ] = useState('');

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const trimmed =
      content.trim();

    if (
      !trimmed ||
      loading
    ) {
      return;
    }

    await onSubmit(trimmed);

    setContent('');
  };

  const canSubmit =
    content.trim().length > 0 &&
    !loading;

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-2"
    >
      <Textarea
        value={content}
        onChange={(event) =>
          setContent(
            event.target.value,
          )
        }
        placeholder={placeholder}
        disabled={loading}
        rows={3}
        maxLength={2000}
        className="resize-none"
      />

      <div className="flex items-center justify-between gap-3">
        <span className="text-xs text-muted-foreground">
          {content.length}/2000
        </span>

        <Button
          type="submit"
          disabled={!canSubmit}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Đang gửi...
            </>
          ) : (
            <>
              <Send className="mr-2 size-4" />
              Bình luận
            </>
          )}
        </Button>
      </div>
    </form>
  );
}