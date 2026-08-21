import { BadRequestException, Injectable } from '@nestjs/common';
import { v2 as cloudinary} from 'cloudinary';
import { FileUpload } from 'graphql-upload-ts';
import toStream = require('streamifier');

@Injectable()
export class CloudinaryService {
  async uploadImage(file: FileUpload) {
  if (!file || !file.createReadStream) {
    throw new Error('File upload không hợp lệ!');
  }

  return new Promise<any>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'travel-social/posts',
        resource_type: 'image',
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(result);
      },
    );

    const stream = file.createReadStream();

    stream.on('error', reject);
    stream.pipe(uploadStream);
  });
}

  private async fileToBuffer(file: FileUpload): Promise<Buffer> {
  const chunks: Buffer[] = [];
  for await (const chunk of file.createReadStream()) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  return Buffer.concat(chunks);
}

  async uploadVideo(file: FileUpload) {
  const MAX_SIZE = 5 * 1024 * 1024;
  const buffer = await this.fileToBuffer(file);

  if (buffer.length > MAX_SIZE) {
    throw new BadRequestException('Video must not exceed 5MB');
  }

  return new Promise<any>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: 'video', folder: 'travel-social/posts' },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      },
    );
    stream.end(buffer);
  });
}
}