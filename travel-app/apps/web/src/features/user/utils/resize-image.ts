export const IMAGE_RESIZE_CONFIG = {
  maxWidth: 1920,
  maxHeight: 1920,
  quality: 0.85,
} as const;

function loadImage(
  src: string,
): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();

    image.onload = () => resolve(image);
    image.onerror = () =>
      reject(
        new Error("Không thể đọc ảnh."),
      );

    image.src = src;
  });
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: string,
  quality: number,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject( new Error( "Không thể xử lý ảnh." ));
          return;
        }

        resolve(blob);
      },
      type,
      quality,
    );
  });
}

export async function resizeImage( file: File ): Promise<File> {
  if (!file.type.startsWith("image/")) {
    return file;
  }

  if (file.type === "image/gif") {
    return file;
  }

  const objectUrl = URL.createObjectURL(file);

  try {
    const image = await loadImage(objectUrl);

    const {
      maxWidth,
      maxHeight,
      quality,
    } = IMAGE_RESIZE_CONFIG;

    const width = image.naturalWidth;
    const height = image.naturalHeight;
    if ( width <= maxWidth && height <= maxHeight) return file;
    

    const scale = Math.min(
      maxWidth / width,
      maxHeight / height,
    );

    const newWidth = Math.round( width * scale );
    const newHeight = Math.round( height * scale);
    const canvas = document.createElement("canvas");

    canvas.width = newWidth;
    canvas.height = newHeight;

    const context = canvas.getContext("2d");

    if (!context) {
      throw new Error( "Không thể tạo canvas.");
    }

    context.drawImage(
      image,
      0,
      0,
      newWidth,
      newHeight,
    );

    const blob = await canvasToBlob(
        canvas,
        file.type,
        quality,
      );

    return new File( [blob], file.name,
      {
        type: file.type,
        lastModified: file.lastModified,
      },
    );
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}