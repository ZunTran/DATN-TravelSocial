'use client';
import { useMutation, useQuery} from '@apollo/client/react';
import {
  NOTIFICATIONS_QUERY,
  MARK_NOTIFICATION_AS_READ_MUTATION,
  MARK_ALL_NOTIFICATIONS_AS_READ_MUTATION,
} from '../api/notification.queries';
import { NotificationPage } from '../types/notification';

interface NotificationsQueryData {
  notifications: NotificationPage;
}

interface NotificationsQueryVariables {
  page: number;
  limit: number;
}

interface MarkNotificationData {
  markNotificationAsRead: boolean;
}

interface MarkNotificationVariables {
  notificationId: string;
}

interface MarkAllData {
  markAllNotificationsAsRead: boolean;
}

export function useNotifications(
  page = 1,
  limit = 10,
) {
  const {
    data,
    loading,
    error,
    refetch,
  } = useQuery<
    NotificationsQueryData,
    NotificationsQueryVariables
  >(
    NOTIFICATIONS_QUERY,
    {
      variables: {
        page,
        limit,
      },

      fetchPolicy: 'cache-and-network',
    },
  );

  const [
    markNotificationAsReadMutation,
    {
      loading: markingAsRead,
    },
  ] = useMutation<
    MarkNotificationData,
    MarkNotificationVariables
  >(
    MARK_NOTIFICATION_AS_READ_MUTATION,
  );

  const [
    markAllNotificationsAsReadMutation,
    {
      loading: markingAllAsRead,
    },
  ] = useMutation<MarkAllData>(
    MARK_ALL_NOTIFICATIONS_AS_READ_MUTATION,
  );

    const markAsRead = async ( notificationId: string ) => {
    await markNotificationAsReadMutation({ variables: { notificationId } });
    await refetch();
    };

  const markAllAsRead = async () => {
    await markAllNotificationsAsReadMutation();
    await refetch();
  };

  return {
    notifications: data?.notifications.data ?? [],
    total: data?.notifications.total ?? 0,
    currentPage: data?.notifications.page ?? page,
    limit: data?.notifications.limit ?? limit,
    totalPages: data?.notifications.totalPages ?? 0,

    loading,
    error,
    refetch,
    markAsRead,
    markAllAsRead,
    markingAsRead,
    markingAllAsRead,
  };
}