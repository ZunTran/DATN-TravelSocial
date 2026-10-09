import { Injectable } from '@nestjs/common';
import { UserGraphqlClient } from '../clients/user-graphql-client';


@Injectable()
export class NotificationService {
  constructor(
    private readonly userGraphqlClient: UserGraphqlClient,
  ) {}

  async notifications( page: number,  limit: number, authorization?: string) {
    const result = await this.userGraphqlClient.execute<{
        notifications: {
          data: any[];
          total: number;
          page: number;
          limit: number;
          totalPages: number;
        };
      }>(
        `
        query Notifications(
          $page: Int!
          $limit: Int!
        ) {
          notifications(
            page: $page
            limit: $limit
          ) {
            data {
              id
              receiverId
              senderId
              type
              message
              postId
              isRead
              createdAt
            }
            total
            page
            limit
            totalPages
          }
        }
        `,
        {
          page,
          limit,
        },
        authorization,
      );

    return {
  ...result.notifications,
  data: result.notifications.data.map((notification) => ({
    ...notification,
    createdAt: new Date(notification.createdAt),
  })),
};
  }

  async markAsRead( notificationId: string, authorization?: string) {
    const result =await this.userGraphqlClient.execute<{
        markNotificationAsRead: boolean;
      }>(
        `
        mutation MarkNotificationAsRead(
          $notificationId: ID!
        ) {
          markNotificationAsRead(
            notificationId: $notificationId
          )
        }
        `,
        {
          notificationId,
        },
        authorization,
      );

    return result.markNotificationAsRead;
  }

  async markAllAsRead( authorization?: string ) {
    const result = await this.userGraphqlClient.execute<{
        markAllNotificationsAsRead: boolean;
      }>(
        `
        mutation MarkAllNotificationsAsRead {
          markAllNotificationsAsRead
        }
        `,
        {},
        authorization,
      );

    return result.markAllNotificationsAsRead;
  }
}