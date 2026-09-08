import {ConflictException,Injectable,NotFoundException,} from '@nestjs/common';
import { InterestTagRepository } from './interest-tag.repository';
import { UserProfileRepository } from '../user-profile/user-profile.repository';
import { GetUserInterestsInput } from './dto/get-user-interests.input';
import { CloudinaryService } from '../../common/cloudinary/cloudinary.service';
import type { FileUpload } from 'graphql-upload-ts';
import { CreateInterestInput, UpdateInterestInput } from './dto/create-interest.input';

@Injectable()
export class InterestTagService {
  constructor(
    private readonly repository: InterestTagRepository,
    private readonly userProfileRepository: UserProfileRepository,
    private readonly cloudinaryService: CloudinaryService
  ) {}

  private async convertUploadToBuffer(upload: FileUpload): Promise<Express.Multer.File> {
  const chunks: Buffer[] = [];

  for await (const chunk of upload.createReadStream()) {
    chunks.push(
      Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk),
    );
  }

  const buffer = Buffer.concat(chunks);

  return {
    fieldname: 'file',
    originalname: upload.filename,
    encoding: upload.encoding,
    mimetype: upload.mimetype,
    size: buffer.length,
    destination: '',
    filename: upload.filename,
    path: '',
    buffer,
    stream: upload.createReadStream(),
  } as Express.Multer.File;
}

  private async uploadIcon( iconFile?: FileUpload) {
  if (!iconFile) 
    return undefined;
  
  const buffer =  await this.convertUploadToBuffer( iconFile);

  const uploadRes =await this.cloudinaryService.uploadImage(
      buffer, 'travel-social/interests',
    );

  return uploadRes.secure_url;
}

  async createTag(input: CreateInterestInput,iconFile?: FileUpload) {
    console.log('[User Service] createTag input:', input);
    const name = input.name?.trim();
    if (!name) {
  throw new ConflictException('Tên interest tag không được để trống');
}
    const existed =await this.repository.findByName(name);
    if (existed) throw new ConflictException('Interest tag đã tồn tại',);
    const iconUrl = await this.uploadIcon(iconFile);
    
    return this.repository.createTag({
      name: name,
      icon_url: iconUrl ?? input.icon_url
    });
  }

  async getAllTags() {
    return this.repository.findAll();
  }

  async findById(id: string) {
    const tag =await this.repository.findById(id);
    if (!tag) throw new NotFoundException('Không tìm thấy interest tag');
    return tag;
  }

  async updateTag(id: string, input: UpdateInterestInput,iconFile?: FileUpload) {
    const tag = await this.repository.findById(id);
    if (!tag) throw new NotFoundException('Không tìm thấy thẻ sở thích');

    const name = input.name?.trim();
    if (name) {
      const existed =await this.repository.findByName(name);
      if (existed && existed.id !== id) throw new ConflictException('Interest tag đã tồn tại');
    }
    const iconUrl = await this.uploadIcon(iconFile);
    input.name = name;
    return this.repository.updateTag(id, {
      ...(name !== undefined ? { name } : {}),
      ...(iconUrl ? { icon_url: iconUrl } : {}),
    });
  }

  async deleteTag(id: string) {
    const tag = await this.repository.findById(id);
    if (!tag) throw new NotFoundException('Không tìm thấy thẻ sở thích');
    return this.repository.deleteTag(id);
  }

  async search(name: string) {
    return this.repository.search(name);
  }

  async getUserInterests(accountId: string) {
    const profile = await this.userProfileRepository.findByAccountId(accountId);
    if (!profile) throw new NotFoundException('Không tìm thấy profile của tài khoản này');
    
    return this.repository.findByProfileId(profile.id);
  }

  async getUserInterestsByProfileId(profileId: string) {
    const profile = await this.userProfileRepository.findById(profileId);
    if (!profile) throw new NotFoundException('Không tìm thấy profile của tài khoản này');
    
    return this.repository.findByProfileId(profile.id);
  }

  async updateUserInterests(accountId: string, interestIds: string[]) {
    const profile = await this.userProfileRepository.findByAccountId(accountId);
    if (!profile) throw new NotFoundException('Không tìm thấy profile của tài khoản này');

    const uniqueInterestIds = [...new Set(interestIds)];

    const existingTags =await this.repository.findByIds(uniqueInterestIds);
    if (existingTags.length !== uniqueInterestIds.length) throw new NotFoundException('Một hoặc nhiều interest tag không tồn tại');

    return this.repository.updateUserInterests(profile.id, uniqueInterestIds);
  }

  
  async getUserInterestsPaginated(accountId: string, input: GetUserInterestsInput) {
    const profile = await this.userProfileRepository.findByAccountId(accountId);
    if (!profile) throw new NotFoundException('Không tìm thấy profile của tài khoản này');

    return this.repository.findByProfileIdPaginated(profile.id, input.page, input.limit);
  }

  async getSuggestedUsersByInterests(accountId: string) {
    const profile = await this.userProfileRepository.findByAccountId(accountId);
    if (!profile) throw new NotFoundException('Không tìm thấy profile của tài khoản này');

    const myInterests = await this.repository.findByProfileId(profile.id);
    const myInterestIds = myInterests.map((tag) => tag.id);

    if (myInterestIds.length === 0) return [];

    return this.repository.findUsersWithCommonInterests(profile.id, myInterestIds);
  }

  async getAllTagsPaginated( page: number, limit: number, search?: string) {
    const safePage =Math.max(1, page || 1);
    const safeLimit =Math.min( 100, Math.max(1, limit || 20));

    return this.repository.findAllPaginated(
      safePage,
      safeLimit,
      search,
    );
  }
}