import { gql } from '@apollo/client';

export const NOTIFICATIONS_QUERY = gql`
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
`;

export const MARK_NOTIFICATION_AS_READ_MUTATION = gql`
  mutation MarkNotificationAsRead(
    $notificationId: ID!
  ) {
    markNotificationAsRead(
      notificationId: $notificationId
    )
  }
`;

export const MARK_ALL_NOTIFICATIONS_AS_READ_MUTATION = gql`
  mutation MarkAllNotificationsAsRead {
    markAllNotificationsAsRead
  }
`;