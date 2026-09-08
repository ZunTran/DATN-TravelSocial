export const POST_FILE_LIMITS = {
  maxFiles: 5,
  maxImageSize: 5 * 1024 * 1024,
  maxVideoSize: 5 * 1024 * 1024,
} as const;

export const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

export const ACCEPTED_VIDEO_TYPES = [
  "video/mp4",
  "video/webm",
  "video/quicktime",
];

export function formatFileSize(
  bytes: number,
): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(
      bytes / 1024
    ).toFixed(1)} KB`;
  }

  return `${(
    bytes /
    (1024 * 1024)
  ).toFixed(1)} MB`;
}

export function validatePostFile(
  file: File,
): string | null {
  const isImage =
    ACCEPTED_IMAGE_TYPES.includes(
      file.type,
    );

  const isVideo =
    ACCEPTED_VIDEO_TYPES.includes(
      file.type,
    );

  if (!isImage && !isVideo) {
    return `File "${file.name}" không được hỗ trợ.`;
  }

  const maxSize = isImage
    ? POST_FILE_LIMITS.maxImageSize
    : POST_FILE_LIMITS.maxVideoSize;

  if (file.size > maxSize) {
    return `File "${file.name}" vượt quá giới hạn ${formatFileSize(
      maxSize,
    )}.`;
  }

  return null;
}


export function validateProcessedPostFile(file: File): string | null {
  const isImage = ACCEPTED_IMAGE_TYPES.includes(file.type);
  const isVideo = ACCEPTED_VIDEO_TYPES.includes(file.type);

  if (!isImage && !isVideo) 
    return `File "${file.name}" không được hỗ trợ.`;

  const maxSize = isImage ? POST_FILE_LIMITS.maxImageSize : POST_FILE_LIMITS.maxVideoSize;

  if (file.size > maxSize) 
    return `File "${file.name}" sau khi xử lý vẫn vượt quá ${formatFileSize( maxSize )}.`;
  
  return null;
}