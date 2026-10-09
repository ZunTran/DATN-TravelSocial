import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, notification_type, user_report_status } from '@prisma/client';
import { NotificationRepository } from './notification.repository';
import { FollowRepository } from '../follow/follow.repository';
import { UserProfileRepository } from '../user-profile/user-profile.repository';

@Injectable()
export class NotificationService {
  constructor(
    private readonly notificationRepository: NotificationRepository,
    private readonly followRepository: FollowRepository,
    private readonly userProfileRepository: UserProfileRepository,
  ) {}

    async createNewFollowerNotification( senderId: string, receiverId: string, senderDisplayName: string, tx?: Prisma.TransactionClient) {
        if (senderId === receiverId) {
            return null;
        }

        return this.notificationRepository.create(
            {
            receiver: {
                connect: { id: receiverId },
            },

            sender: {
                connect: { id: senderId },
            },

            type: notification_type.NEW_FOLLOWER,
            message: `${senderDisplayName} đã follow bạn`,
            data: { action: 'FOLLOW'},
            },
            tx,
        );
    }

    async markAsRead( accountId: string, notificationId: string ) {
        const profile = await this.userProfileRepository.findByAccountId(accountId);
        if (!profile) 
            throw new NotFoundException('Không tìm thấy profile');
        
        const result =await this.notificationRepository.markAsRead( notificationId, profile.id );
        if (result.count === 0) {
            throw new NotFoundException('Notification not found');
        }

        return true;
    }

    async markAllAsRead( accountId: string) {
        const profile = await this.userProfileRepository.findByAccountId(accountId);
        if (!profile) 
            throw new NotFoundException('Không tìm thấy profile');
        
        await this.notificationRepository.markAllAsRead(profile.id);
        return true;
    }

    async findByUser( accountId: string, page: number, limit: number) {
        const profile = await this.userProfileRepository.findByAccountId( accountId );
        if (!profile) 
            throw new NotFoundException( 'Không tìm thấy profile' );
        
        const result = await this.notificationRepository.findByUser( profile.id, page, limit);
        return {
            ...result,
            data: result.data.map(
            (notification) =>
                this.mapNotification(notification),
            ),
        };
    }

    private mapNotification(notification: any) {
  return {
    id: notification.id,
    receiverId: notification.receiver_id,
    senderId: notification.sender_id,
    type: notification.type,
    message: notification.message,
    postId:
      notification.data &&
      typeof notification.data === 'object' &&
      'postId' in notification.data ? notification.data.postId : null,
    isRead: notification.is_read,
    createdAt: new Date(notification.created_at)
  };
}

    async createReportStatusNotification( reporterId: string, status: user_report_status) {
    let message: string;
    switch (status) {
        case user_report_status.REVIEWING:
        message ='Báo cáo của bạn đang được quản trị viên xem xét';
        break;

        case user_report_status.RESOLVED:
        message = 'Báo cáo của bạn đã được quản trị viên xử lý';
        break;

        case user_report_status.REJECTED:
        message = 'Báo cáo của bạn đã được xem xét và không được chấp nhận';
        break;

        default:
        return null;
    }

    return this.notificationRepository.create({
        receiver: {
        connect: {id: reporterId}},
        type: notification_type.SYSTEM_NOTIFICATION,
        message,
        data: {
        action: 'REPORT_STATUS_UPDATED',
        status,
        },
    });
    }
}