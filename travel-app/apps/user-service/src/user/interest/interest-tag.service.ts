import {ConflictException,Injectable,NotFoundException,} from '@nestjs/common';
import { InterestTagRepository } from './interest-tag.repository';
import { UserProfileRepository } from '../user-profile/user-profile.repository';
import { CreateInterestInput, UpdateInterestInput } from './dto/create-interest.input.ts';
import { GetUserInterestsInput } from './dto/get-user-interests.input';


@Injectable()
export class InterestTagService {
  constructor(
    private readonly repository: InterestTagRepository,
    private readonly userProfileRepository: UserProfileRepository,
  ) {}

  async createTag(input: CreateInterestInput) {
    const name = input.name.trim();
    const existed =await this.repository.findByName(name);

    if (existed) throw new ConflictException('Interest tag đã tồn tại',);
    
    return this.repository.createTag({
      name: name,
      icon_url: input.icon_url,
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

  async updateTag(id: string, input: UpdateInterestInput) {
    const tag = await this.repository.findById(id);
    if (!tag) throw new NotFoundException('Không tìm thấy thẻ sở thích');

    const name = input.name?.trim();
    if (name) {
      const existed =await this.repository.findByName(name);
      if (existed && existed.id !== id) throw new ConflictException('Interest tag đã tồn tại');
    }
    input.name = name;
    return this.repository.updateTag(id, input);
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

  async updateUserInterests(accountId: string, interestIds: string[]) {
    const profile = await this.userProfileRepository.findByAccountId(accountId);
    if (!profile) throw new NotFoundException('Không tìm thấy profile của tài khoản này');

    const existingTags = await this.repository.findByIds(interestIds);
    if (existingTags.length !== interestIds.length) throw new NotFoundException('Một hoặc nhiều interest tag không tồn tại');

    return this.repository.updateUserInterests(profile.id, interestIds);
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
}