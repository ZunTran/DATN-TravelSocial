import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { UpdateProfileInput } from './dto/update-profile.input';
import { CreateProfileInput } from './dto/create-profile.input';
import { UserProfileRepository } from './user-profile.repository';


@Injectable()
export class UserService {
  constructor(private readonly profileRepo: UserProfileRepository) {}

  async createProfile(accountId: string, input: CreateProfileInput) {
    const existingProfile = await this.profileRepo.findByAccountId(accountId);
    if (existingProfile) throw new BadRequestException('Tài khoản này đã có hồ sơ cá nhân!');
    
    const existingUsername = await this.profileRepo.findByUsername(input.username);
    if (existingUsername) throw new BadRequestException('Username này đã có người sử dụng!');

    return this.profileRepo.create(accountId, input);
  }

  async getMyProfile(accountId: string) {
    const profile = await this.profileRepo.findByAccountId(accountId);
    if (!profile) throw new NotFoundException('Không tìm thấy hồ sơ cá nhân!');
    return profile;
  }

  async updateProfile(accountId: string, input: UpdateProfileInput) {
    // const profile = await this.getMyProfile(accountId);
    return this.profileRepo.updateByAccountId(accountId, input);
  }
}