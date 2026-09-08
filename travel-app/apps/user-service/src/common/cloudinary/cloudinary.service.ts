import { Injectable } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';
import toStream = require('streamifier');

@Injectable()
export class CloudinaryService {
  async uploadImage(file: Express.Multer.File, folderName: string = 'travel-social/profiles'): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        {
          folder: folderName,
        },
        (error, result) => {
          if (error) return reject(error);
          if (!result) return reject(new Error('Upload lên Cloudinary thất bại, không có kết quả trả về!'));
          resolve(result);
        },
      );

      if (file && file.buffer) {
        toStream.createReadStream(file.buffer).pipe(upload);
      } else {
        reject(new Error('File không hợp lệ hoặc thiếu buffer!'));
      }
    });
  }
}