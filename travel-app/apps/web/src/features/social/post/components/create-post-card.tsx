'use client';

import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
} from 'react';
import { toast } from 'sonner';
import { Image as ImageIcon, MapPin } from 'lucide-react';

import { useProfile } from '@/features/user/user-profile/hooks/use-profile';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { usePostCrud } from '../hooks/use-post-crud';
import type { Post, UpdatePostInput } from '../types/post.types';
import { POST_FILE_LIMITS, validatePostFile, validateProcessedPostFile } from '@/features/user/utils/post-file';
import { resizeImage } from '@/features/user/utils/resize-image';
import { PostMediaPicker } from './post-media-picker';
import { CategoryPicker } from '../../metadata/components/category-picker';
import { LocationPicker } from '../../metadata/components/location-picker';
import { HashtagPicker } from '../../metadata/components/hashtag-picker';

import type { LocationOption } from '../../metadata/types/location.types';
import type { CategoryOption } from '../../metadata/types/category.types';
import type { HashtagOption } from '../../metadata/types/hashtag.types';

interface CreatePostCardProps {
  editingPost?: Post | null;
  onCreated?: (post: Post) => void;
  onEditSuccess?: (post: Post) => void;
  onEditCancel?: () => void;
}

type PostStatus = 'DRAFT' | 'PUBLISHED';
type PostPrivacy = 'PUBLIC' | 'PRIVATE';

interface PersistedPostForm {
  content: string;
  privacy: PostPrivacy;
  selectedCategory: CategoryOption | null;
  selectedLocation: LocationOption | null;
  selectedHashtags: HashtagOption[];
  savedAt: number;
}

const CREATE_STORAGE_KEY = 'travel-social:create-post-form';

const getEditStorageKey = (postId: string) =>
  `travel-social:edit-post-form:${postId}`;

export function CreatePostCard({
  editingPost,
  onCreated,
  onEditSuccess,
  onEditCancel,
}: CreatePostCardProps) {
  const { profile } = useProfile();

  const {
    createPost,
    createPostWithFiles,
    creating,
    updatePost,
    updatePostWithFiles,
    updating,
  } = usePostCrud();

  const isEditMode = Boolean(editingPost);
  const isSubmitting = creating || updating;

  const [open, setOpen] = useState(Boolean(editingPost));

  const [selectedLocation, setSelectedLocation] =
    useState<LocationOption | null>(null);

  const [selectedCategory, setSelectedCategory] =
    useState<CategoryOption | null>(null);

  const [selectedHashtags, setSelectedHashtags] =
    useState<HashtagOption[]>([]);

  const [content, setContent] = useState('');
  const [privacy, setPrivacy] = useState<PostPrivacy>('PUBLIC');
  const [error, setError] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState('');
  const [processingFiles, setProcessingFiles] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const getStorageKey = () => {
    if (editingPost?.id) {
      return getEditStorageKey(editingPost.id);
    }

    return CREATE_STORAGE_KEY;
  };

  const clearPersistedForm = () => {
    if (typeof window === 'undefined') return;

    try {
      window.sessionStorage.removeItem(getStorageKey());
    } catch (error) {
      console.warn('Cannot clear persisted post form:', error);
    }
  };

  const resetForm = () => {
    setContent('');
    setPrivacy('PUBLIC');
    setSelectedLocation(null);
    setSelectedCategory(null);
    setSelectedHashtags([]);
    setFiles([]);
    setError('');
    setFileError('');
    setProcessingFiles(false);
  };

  const getPostErrorMessage = (error: unknown) => {
    const err = error as {
      message?: string;
      graphQLErrors?: Array<{ message?: string }>;
      networkError?: {
        result?: {
          errors?: Array<{ message?: string }>;
        };
      };
    };

    const message =
      err?.graphQLErrors?.[0]?.message ||
      err?.networkError?.result?.errors?.[0]?.message ||
      err?.message ||
      '';

    if (message.includes('Maximum 10 drafts allowed')) {
      return 'Bạn đã đạt giới hạn 10 bản nháp. Hãy chỉnh sửa hoặc xóa một bản nháp trước khi tạo mới.';
    }

    return message || 'Không thể thực hiện thao tác. Vui lòng thử lại.';
  };

  useEffect(() => {
    if (!editingPost) {
      setOpen(false);
      return;
    }

    setOpen(true);

    let nextContent = editingPost.content ?? '';

    let nextPrivacy: PostPrivacy =
      editingPost.privacy === 'PRIVATE' ? 'PRIVATE' : 'PUBLIC';

    let nextCategory: CategoryOption | null = editingPost.category
      ? {
          id: editingPost.category.id,
          name: editingPost.category.name,
          description: editingPost.category.description ?? undefined,
        }
      : null;

    let nextLocation: LocationOption | null = editingPost.location
      ? {
          id: editingPost.location.id,
          name: editingPost.location.name,
          address: editingPost.location.address ?? undefined,
          latitude: editingPost.location.latitude ?? undefined,
          longitude: editingPost.location.longitude ?? undefined,
          province: editingPost.location.province ?? undefined,
        }
      : null;

    let nextHashtags: HashtagOption[] =
      editingPost.hashtags?.map((hashtag) => ({
        id: hashtag.id,
        name: hashtag.name,
      })) ?? [];

    if (typeof window !== 'undefined') {
      try {
        const raw = window.sessionStorage.getItem(
          getEditStorageKey(editingPost.id),
        );

        if (raw) {
          const saved = JSON.parse(raw) as PersistedPostForm;
          const maxAge = 24 * 60 * 60 * 1000;
          const isValidSnapshot = Date.now() - saved.savedAt <= maxAge;

          if (isValidSnapshot) {
            nextContent = saved.content;
            nextPrivacy = saved.privacy;
            nextCategory = saved.selectedCategory ?? null;
            nextLocation = saved.selectedLocation ?? null;
            nextHashtags = saved.selectedHashtags ?? [];
          } else {
            window.sessionStorage.removeItem(
              getEditStorageKey(editingPost.id),
            );
          }
        }
      } catch (error) {
        console.warn('Cannot restore persisted post form:', error);
      }
    }

    setContent(nextContent);
    setPrivacy(nextPrivacy);
    setSelectedCategory(nextCategory);
    setSelectedLocation(nextLocation);
    setSelectedHashtags(nextHashtags);
    setFiles([]);
    setError('');
    setFileError('');
  }, [editingPost]);

  useEffect(() => {
    if (!open || typeof window === 'undefined') return;

    const timeout = window.setTimeout(() => {
      try {
        const data: PersistedPostForm = {
          content,
          privacy,
          selectedCategory,
          selectedLocation,
          selectedHashtags,
          savedAt: Date.now(),
        };

        window.sessionStorage.setItem(
          getStorageKey(),
          JSON.stringify(data),
        );
      } catch (error) {
        console.warn('Cannot persist post form:', error);
      }
    }, 300);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [
    open,
    content,
    privacy,
    selectedCategory,
    selectedLocation,
    selectedHashtags,
    editingPost?.id,
  ]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleCancel = () => {
    if (isSubmitting || processingFiles) {
      return;
    }

    clearPersistedForm();
    resetForm();
    setOpen(false);

    if (isEditMode) {
      onEditCancel?.();
    }
  };

  const validateBeforeSubmit = () => {
    const trimmedContent = content.trim();
    const hasExistingMedia = (editingPost?.media?.length ?? 0) > 0;
    const hasAnyMedia = hasExistingMedia || files.length > 0;

    if (!trimmedContent && !hasAnyMedia) {
      setError(
        isEditMode
          ? 'Bài viết phải có nội dung hoặc media.'
          : 'Please write something before saving.',
      );

      return false;
    }

    return true;
  };

  const buildInput = (status: PostStatus): UpdatePostInput | null => {
    if (!editingPost) {
      return null;
    }

    const input: UpdatePostInput = {
      id: editingPost.id,
      content: content.trim(),
      privacy,
      status,
      ...(selectedCategory ? { categoryId: selectedCategory.id } : {}),
      ...(selectedLocation ? { locationId: selectedLocation.id } : {}),
      hashtagIds: selectedHashtags.map((item) => item.id),
    };

    return input;
  };

  const handleCreate = async (status: PostStatus) => {
  if (!validateBeforeSubmit()) {
    return;
  }

  const trimmedContent = content.trim();

  try {
    setError('');
    setFileError('');

    const input = {
      content: trimmedContent,
      privacy,
      status: status as 'DRAFT' | 'PUBLISHED',
      ...(selectedCategory ? { categoryId: selectedCategory.id } : {}),
      ...(selectedLocation ? { locationId: selectedLocation.id } : {}),
      ...(selectedHashtags.length
        ? { hashtagIds: selectedHashtags.map((item) => item.id) }
        : {}),
    };

    const post =
      files.length > 0
        ? await createPostWithFiles(input, files)
        : await createPost(input);

    if (!post) {
      const message =
        status === 'DRAFT'
          ? 'Không thể lưu bản nháp.'
          : 'Không thể tạo bài viết.';

      setError(message);
      toast.error(message);
      return;
    }

    clearPersistedForm();

    if (status === 'PUBLISHED') {
      onCreated?.(post);
      toast.success('Đăng bài viết thành công!');
    } else {
      toast.success('Đã lưu bài viết vào bản nháp!');
    }

    resetForm();
    setOpen(false);
  } catch (error) {
    console.error('Failed to create post:', error);

    const message = getPostErrorMessage(error);

    setError(message);
    toast.error(message);
  }
};

const handleUpdate = async (status: PostStatus) => {
  if (!editingPost) {
    return;
  }

  if (!validateBeforeSubmit()) {
    return;
  }

  try {
    setError('');
    setFileError('');

    const input = buildInput(status);

    if (!input) {
      const message = 'Không tìm thấy bài viết cần chỉnh sửa.';
      setError(message);
      toast.error(message);
      return;
    }

    const post =
      files.length > 0
        ? await updatePostWithFiles(input, files)
        : await updatePost(input);

    if (!post) {
      const message =
        status === 'DRAFT'
          ? 'Không thể cập nhật bản nháp.'
          : 'Không thể đăng bài viết.';

      setError(message);
      toast.error(message);
      return;
    }

    clearPersistedForm();

    if (status === 'PUBLISHED') {
      onEditSuccess?.(post);
      toast.success('Đã đăng bài viết!');
    } else {
      toast.success('Đã cập nhật bản nháp!');
    }

    resetForm();
    setOpen(false);
  } catch (error) {
    console.error('Failed to update post:', error);

    const message = getPostErrorMessage(error);

    setError(message);
    toast.error(message);
  }
};

  const handleSaveDraft = async () => {
    if (isEditMode) {
      await handleUpdate('DRAFT');
      return;
    }

    await handleCreate('DRAFT');
  };

  const handlePublish = async () => {
    if (isEditMode) {
      await handleUpdate('PUBLISHED');
      return;
    }

    await handleCreate('PUBLISHED');
  };

  const handleFilesSelected = async (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const selectedFiles = Array.from(event.target.files ?? []);

    event.target.value = '';

    if (!selectedFiles.length) {
      return;
    }

    setFileError('');

    if (
      files.length + selectedFiles.length >
      POST_FILE_LIMITS.maxFiles
    ) {
      setFileError(
        `Bạn chỉ có thể chọn tối đa ${POST_FILE_LIMITS.maxFiles} file.`,
      );
      return;
    }

    for (const file of selectedFiles) {
      const validationError = validatePostFile(file);

      if (validationError) {
        setFileError(validationError);
        return;
      }
    }

    try {
      setProcessingFiles(true);

      const processedFiles: File[] = [];

      for (const file of selectedFiles) {
        let processedFile = file;

        if (file.type.startsWith('image/')) {
          processedFile = await resizeImage(file);
        }

        const processedError =
          validateProcessedPostFile(processedFile);

        if (processedError) {
          setFileError(processedError);
          return;
        }

        processedFiles.push(processedFile);
      }

      setFiles((previous) => [...previous, ...processedFiles]);
    } catch (error) {
      console.error('Failed to process media:', error);
      setFileError('Không thể xử lý file. Vui lòng thử lại.');
    } finally {
      setProcessingFiles(false);
    }
  };

  const renderExistingMedia = () => {
    if (!isEditMode) {
      return null;
    }

    const existingMedia = editingPost?.media ?? [];

    if (!existingMedia.length) {
      return null;
    }

    return (
      <div className="space-y-2">
        <p className="text-sm font-medium">Media hiện tại</p>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {existingMedia.map((media) => (
            <div
              key={media.id}
              className="relative overflow-hidden rounded-lg border bg-muted"
            >
              {media.mediaType === 'VIDEO' ? (
                <video
                  src={media.mediaUrl}
                  controls
                  preload="metadata"
                  className="aspect-square w-full object-cover"
                />
              ) : (
                <img
                  src={media.mediaUrl}
                  alt="Post media"
                  className="aspect-square w-full object-cover"
                />
              )}
            </div>
          ))}
        </div>

        <p className="text-xs text-muted-foreground">
          Media hiện tại sẽ được giữ lại. Các file mới bạn chọn sẽ được gửi cùng lúc cập nhật.
        </p>
      </div>
    );
  };

  if (!open && !isEditMode) {
    return (
      <section className="rounded-2xl border bg-card p-4 shadow-sm">
        <div className="flex gap-3">
          <Avatar className="size-11 shrink-0">
            {profile?.avatar_url && (
              <AvatarImage
                src={profile.avatar_url}
                alt={profile.username ?? 'User'}
              />
            )}

            <AvatarFallback>
              {profile?.username?.charAt(0).toUpperCase() ?? 'U'}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex-1">
            <p className="mb-2 text-sm font-semibold">
              {profile?.username ?? 'User'}
            </p>

            <button
              type="button"
              onClick={handleOpen}
              className="flex h-11 w-full items-center rounded-full bg-muted px-4 text-left text-sm text-muted-foreground transition-colors hover:bg-muted/80 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              What's on your mind?
            </button>
          </div>
        </div>

        <div className="mt-4 border-t pt-3">
          <div className="grid grid-cols-3 gap-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="gap-2"
              onClick={() => {
                handleOpen();

                setTimeout(() => {
                  fileInputRef.current?.click();
                }, 0);
              }}
              disabled={isSubmitting || processingFiles}
            >
              <ImageIcon className="size-4 text-green-500" />

              <span className="hidden sm:inline">
                Photo / Video
              </span>
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="gap-2"
              onClick={handleOpen}
              disabled={isSubmitting || processingFiles}
            >
              <MapPin className="size-4 text-primary" />

              <span className="hidden sm:inline">Location</span>
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border bg-card p-4 shadow-sm">
      <div className="flex gap-3">
        <Avatar className="size-11 shrink-0">
          {profile?.avatar_url && (
            <AvatarImage
              src={profile.avatar_url}
              alt={profile.username ?? 'User'}
            />
          )}

          <AvatarFallback>
            {profile?.username?.charAt(0).toUpperCase() ?? 'U'}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <p className="mb-1 text-sm font-semibold">
            {profile?.username ?? 'User'}
          </p>

          <p className="text-xs text-muted-foreground">
            {isEditMode ? 'Chỉnh sửa bản nháp' : 'Tạo bài viết mới'}
          </p>
        </div>
      </div>

      <div className="mt-4 space-y-4">
        <Textarea
          autoFocus
          value={content}
          onChange={(event) => {
            setContent(event.target.value);

            if (error) {
              setError('');
            }
          }}
          placeholder="What's on your mind?"
          className="min-h-40 resize-none"
          disabled={isSubmitting}
        />

        {renderExistingMedia()}

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={
              isSubmitting ||
              processingFiles ||
              files.length >= POST_FILE_LIMITS.maxFiles
            }
          >
            {processingFiles ? (
              <>
                <span className="mr-2 size-4 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
                Đang xử lý...
              </>
            ) : (
              <>
                <ImageIcon className="mr-2 size-4 text-green-500" />
                Photo / Video
              </>
            )}
          </Button>

          <span className="text-xs text-muted-foreground">
            {files.length}/{POST_FILE_LIMITS.maxFiles} file mới
          </span>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,video/quicktime"
          multiple
          className="hidden"
          onChange={handleFilesSelected}
          disabled={isSubmitting || processingFiles}
        />

        <PostMediaPicker
          files={files}
          onChange={setFiles}
          disabled={isSubmitting || processingFiles}
        />

        <div className="flex flex-wrap items-center gap-2">
          <CategoryPicker
            value={selectedCategory}
            onChange={setSelectedCategory}
            disabled={isSubmitting || processingFiles}
          />

          <LocationPicker
            value={selectedLocation}
            onChange={setSelectedLocation}
            disabled={isSubmitting || processingFiles}
          />

          <HashtagPicker
            value={selectedHashtags}
            onChange={setSelectedHashtags}
            disabled={isSubmitting || processingFiles}
          />
        </div>

        {(selectedCategory ||
          selectedLocation ||
          selectedHashtags.length > 0) && (
          <div className="flex flex-wrap gap-2">
            {selectedCategory && (
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                #{selectedCategory.name}
              </span>
            )}

            {selectedLocation && (
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                📍 {selectedLocation.name}
              </span>
            )}

            {selectedHashtags.map((hashtag) => (
              <span
                key={hashtag.id}
                className="rounded-full bg-muted px-3 py-1 text-xs font-medium"
              >
                #{hashtag.name}
              </span>
            ))}
          </div>
        )}

        {fileError && (
          <p className="text-sm text-destructive">{fileError}</p>
        )}

        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Privacy:</span>

          <select
            value={privacy}
            onChange={(event) =>
              setPrivacy(event.target.value as PostPrivacy)
            }
            disabled={isSubmitting}
            className="rounded-md border bg-background px-2 py-1 text-sm"
          >
            <option value="PUBLIC">Public</option>
            <option value="PRIVATE">Private</option>
          </select>
        </div>

        <div className="flex items-center justify-end gap-2 border-t pt-3">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isSubmitting || processingFiles}
          >
            Hủy
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={handleSaveDraft}
            disabled={
              isSubmitting ||
              processingFiles ||
              (!content.trim() &&
                (editingPost?.media?.length ?? 0) === 0 &&
                files.length === 0)
            }
          >
            {isSubmitting
              ? isEditMode
                ? 'Đang cập nhật...'
                : 'Đang lưu...'
              : isEditMode
                ? 'Lưu thay đổi'
                : 'Lưu nháp'}
          </Button>

          <Button
            type="button"
            onClick={handlePublish}
            disabled={
              isSubmitting ||
              processingFiles ||
              (!content.trim() &&
                (editingPost?.media?.length ?? 0) === 0 &&
                files.length === 0)
            }
          >
            {isSubmitting
              ? 'Đang xử lý...'
              : isEditMode
                ? 'Đăng bài'
                : 'Đăng'}
          </Button>
        </div>
      </div>
    </section>
  );
}
