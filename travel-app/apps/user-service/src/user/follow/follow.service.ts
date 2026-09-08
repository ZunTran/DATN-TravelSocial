import {ConflictException,Injectable,NotFoundException,} from '@nestjs/common';
import { FollowRepository } from './follow.repository';
import { UserProfileRepository } from '../user-profile/user-profile.repository';
import { NotificationRepository } from '../notification/notification.repository';
import { BlockRepository } from '../block/block.repository';
import { TransactionService } from '../../prisma/transaction.service';
@Injectable()
export class FollowService {
  constructor(
    private readonly repository: FollowRepository,
    private readonly userProfileRepository: UserProfileRepository,
    private readonly blockRepository: BlockRepository,
    private readonly notificationRepository: NotificationRepository,
    private readonly transactionService: TransactionService,
  ) {}

  async follow(accountId: string, targetProfileId: string) {
    const profile =await this.userProfileRepository.findByAccountId(accountId);
    if (!profile) throw new NotFoundException('Không tìm thấy profile');
    
    if (profile.id === targetProfileId) throw new ConflictException('Không thể tự follow chính mình');

    const target =await this.userProfileRepository.findById(targetProfileId);
    if (!target) throw new NotFoundException('Không tìm thấy người dùng');
    
    const blocked =await this.blockRepository.isEitherBlocked(profile.id, targetProfileId);
    if (blocked) throw new ConflictException('Không thể follow người dùng này');

    const existed = await this.repository.find(profile.id,targetProfileId);
    if (existed) throw new ConflictException('Đã follow người dùng này');
    
     return this.transactionService.run(async (tx) => {

      const follow =await this.repository.create(
        profile.id,
        targetProfileId,
        tx,
      );

      await this.notificationRepository.create({
        receiver: {connect: {id: targetProfileId}},
        sender: {connect: {id: profile.id}},
        type: 'NEW_FOLLOWER',
        message: `${profile.display_name} đã follow bạn`
      },
      tx,
    );

    return follow;
    });
  }

  async unfollow(accountId: string, targetProfileId: string) {
    const profile =await this.userProfileRepository.findByAccountId(accountId);
    if (!profile)throw new NotFoundException('Không tìm thấy profile');

    const existed = await this.repository.find(profile.id,targetProfileId);
    if (!existed) throw new NotFoundException('Bạn chưa follow người dùng này');
    
    await this.repository.delete(profile.id,targetProfileId);
    return true;
  }

  async isFollowing(accountId: string,targetProfileId: string) {
    const profile =await this.userProfileRepository.findByAccountId(accountId);
    if (!profile) throw new NotFoundException('Không tìm thấy profile');
    
    const follow = await this.repository.find(profile.id,targetProfileId);
    return !!follow;
  }

    async getFollowers( profileId: string, page: number, limit: number) {
    const profile = await this.userProfileRepository.findById(profileId);

    if (!profile) 
      throw new NotFoundException( 'Không tìm thấy profile'  );

    return this.repository.findFollowers(
      profileId,
      page,
      limit,
    );
  }

  async getFollowing(profileId: string,page: number,limit: number) {
    const profile =await this.userProfileRepository.findById(profileId);
    if (!profile) throw new NotFoundException('Không tìm thấy profile');

    return this.repository.findFollowing(
      profileId,
      page,
      limit
    );
  }

  async countFollowers(profileId: string) {
    return this.repository.countFollowers(profileId);
  }

  async countFollowing(profileId: string) {
    return this.repository.countFollowing(profileId);
  }

 async getFollowingProfileIds(
  accountId: string,
): Promise<string[]> {
  const profile= await this.userProfileRepository.findByAccountId(accountId);
  if(!profile) throw new NotFoundException('Không tìm thấy profile');

  const profileId= profile.id
  const follows = await this.repository.findFollowingIds(
    profileId,
  );

  return follows.map(
    (follow) => follow.following_id,
  );
}

}