import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { UserProfileRepository } from './user-profile.repository';
import { CreateProfileInput } from './dto/create-profile.input';
import { UpdateProfileInput } from './dto/update-profile.input';
import { SearchUserInput } from './dto/search-user.input';
import { CloudinaryService } from '../../common/cloudinary/cloudinary.service';
import { FileUpload } from 'graphql-upload-ts';
import { user_privacy } from '@prisma/client';


@Injectable()
export class UserProfileService {
  constructor(
    private readonly repository: UserProfileRepository,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async createProfile(account_id: string,input: CreateProfileInput,) {
    const existed =await this.repository.findByAccountId(account_id);

    if (existed) throw new ConflictException('Profile đã tồn tại',);
  
    const username =await this.repository.findByUsername(input.username);

    if (username) throw new ConflictException('Username đã tồn tại',);
    
    return this.repository.create({
      account_id,
      username: input.username,
      display_name: input.display_name,

      avatar_url: input.avatar_url,
      cover_url: input.cover_url,
      bio: input.bio,
      gender: input.gender,
      birthday: input.birthday,
      location: input.location,
    });
  }

  async getMyProfile(account_id: string) {
    const profile =await this.repository.findByAccountId(account_id,);
    if (!profile) throw new NotFoundException('Không tìm thấy profile',);
    
    return profile;
  }

  async getUserProfile(id: string) {
    const profile =
      await this.repository.findById(id);

    if (!profile) {
      throw new NotFoundException(
        'Không tìm thấy profile',
      );
    }

    return profile;
  }

  async updateProfile(
    account_id: string,
    input: UpdateProfileInput,
  ) {
    const profile =
      await this.repository.findByAccountId(
        account_id,
      );

    if (!profile) {
      throw new NotFoundException(
        'Không tìm thấy profile',
      );
    }

    if (
      input.username &&
      input.username !== profile.username
    ) {
      const existed =
        await this.repository.findByUsername(
          input.username,
        );

      if (existed) {
        throw new ConflictException(
          'Username đã tồn tại',
        );
      }
    }

    return this.repository.update(
      profile.id,
      {
        username: input.username,
        display_name: input.display_name,
        avatar_url: input.avatar_url,
        cover_url: input.cover_url,
        bio: input.bio,
        gender: input.gender,
        birthday: input.birthday,
        location: input.location,
        privacy: input.privacy,
        updated_at: new Date(),
      },
    );
  }

  async updatePrivacy(account_id: string,privacy: user_privacy
  ) {
    const profile =await this.repository.findByAccountId(account_id,);

    if (!profile) throw new NotFoundException('Không tìm thấy profile');

    return this.repository.update(profile.id, {
    privacy,
  });
  }

  async checkUsername(username: string) {
    const profile =
      await this.repository.findByUsername(
        username,
      );

    return !profile;
  }


  async searchUsers(input: SearchUserInput) {
  return this.repository.searchUsers(input);
}



  private async convertUploadToBuffer(fileUpload: FileUpload): Promise<Express.Multer.File> {
    const { createReadStream, filename, mimetype } = fileUpload;
    const stream = createReadStream();
    
    const chunks: Buffer[] = [];
    for await (const chunk of stream) {
      chunks.push(Buffer.from(chunk));
    }
    const buffer = Buffer.concat(chunks);

    return {
      fieldname: 'file',
      originalname: filename,
      encoding: '7bit',
      mimetype,
      size: buffer.length,
      stream,
      destination: '',
      filename,
      path: '',
      buffer,
    };
  }

  async updateProfileWithFiles(
    account_id: string,
    input: UpdateProfileInput,
    avatarFile?: FileUpload,
    coverFile?: FileUpload,
  ) {
    const profile = await this.repository.findByAccountId(account_id);
    if (!profile) throw new NotFoundException('Không tìm thấy profile');

    let avatar_url = input.avatar_url;
    let cover_url = input.cover_url;

    if (avatarFile) {
      const multerFile = await this.convertUploadToBuffer(avatarFile);
      const uploadRes = await this.cloudinaryService.uploadImage(multerFile, 'travel-social/avatars');
      avatar_url = uploadRes.secure_url;
    }

    if (coverFile) {
      const multerFile = await this.convertUploadToBuffer(coverFile);
      const uploadRes = await this.cloudinaryService.uploadImage(multerFile, 'travel-social/covers');
      cover_url = uploadRes.secure_url;
    }

    return this.repository.update(profile.id, {
      ...input,
      avatar_url,
      cover_url,
      updated_at: new Date(),
    });
  }

}

